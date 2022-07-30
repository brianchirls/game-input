import ButtonInputControl, { ButtonInputControlOptions } from '../controls/ButtonInputControl';
import AxisInputControl from '../controls/AxisInputControl';
import Vector2InputControl, { Vector2InputControlOptions } from '../controls/Vector2InputControl';
import boolAsNum from '../util/boolAsNum';
import { ThrottledDevice, ThrottledDeviceOptions } from '../Device';
import { InputControlOptions } from '../controls/InputControl';

const buttonNameDefs = {
	leftMouseButton: {
		device: 'mouse',
		index: 0
	},
	touch: {
		device: 'touch',
		index: 0
	},
	penTip: {
		device: 'pen',
		index: 0
	},
	middleMouseButton: {
		device: 'mouse',
		index: 1
	},
	rightMouseButton: {
		device: 'mouse',
		index: 2
	},
	penBarrelButton: {
		device: 'pen',
		index: 2
	},
	mouseBackButton: {
		device: 'mouse',
		index: 3
	},
	mouseForwardButton: {
		device: 'mouse',
		index: 4
	},
	penEraser: {
		device: 'pen',
		index: 5
	}
};

const buttonDefs = [];

const buttonNames = new Set(Object.keys(buttonNameDefs));
buttonNames.forEach(name => {
	const { device, index } = buttonNameDefs[name];
	if (!buttonDefs[index]) {
		buttonDefs[index] = {};
	}
	buttonDefs[index][device] = name;
});

function getButtonName(evt: PointerEvent, buttonIndex = evt.button) {
	if (buttonIndex >= 0 && buttonIndex < buttonDefs.length && evt.isPrimary) {
		const def = buttonDefs[buttonIndex];
		return def[evt.pointerType] || '';
	}

	return '';
}

const controlDefs = {
	position: {
		constructor: Vector2InputControl,
		reader: evt => [evt.x, evt.y] as [number, number]
	},
	pagePosition: {
		constructor: Vector2InputControl,
		reader: evt => [evt.pageX, evt.pageY] as [number, number]
	},
	screenPosition: {
		constructor: Vector2InputControl,
		reader: evt => [evt.screenX, evt.screenY] as [number, number]
	},
	tilt: {
		constructor: Vector2InputControl,
		reader: evt => [evt.screenX / 90, evt.screenY / 90]
	},
	contact: {
		constructor: Vector2InputControl,
		reader: evt => [evt.width, evt.height]
	},
	delta: {
		constructor: Vector2InputControl,
		reader: (evt, previousEvent, defaultValue) => {
			if (!previousEvent) {
				return defaultValue;
			}

			const dt = (evt.timeStamp - previousEvent.timeStamp) * 0.1 || 1;
			return [
				(evt.x - previousEvent.x) / dt,
				(evt.y - previousEvent.y) / dt
			];
		}
	},
	pageDelta: {
		constructor: Vector2InputControl,
		reader: (evt, previousEvent, defaultValue) => {
			if (!previousEvent) {
				return defaultValue;
			}

			const dt = evt.timeStamp - previousEvent.timeStamp || 1;
			return [
				(evt.pageX - previousEvent.pageX) / dt,
				(evt.pageY - previousEvent.pageY) / dt
			];
		}
	},
	screenDelta: {
		constructor: Vector2InputControl,
		reader: 'movementX' in MouseEvent.prototype ?
			(evt, previousEvent, defaultValue) => evt ?
				[evt.movementX, evt.movementY] :
				defaultValue :
			(evt, previousEvent, defaultValue) => {
				if (!previousEvent) {
					return defaultValue;
				}

				const dt = evt.timeStamp - previousEvent.timeStamp || 1;
				return [
					(evt.screenX - previousEvent.screenX) / dt,
					(evt.screenY - previousEvent.screenY) / dt
				];
			}
	}
} as const;

const pressure = {
	constructor: AxisInputControl,
	reader: (evt: PointerEvent) => evt.pressure || 0
};

type ControlDef = {
	constructor: InstanceType<any>,
	reader: (evt: PointerEvent, previousEvent?: PointerEvent, defaultValue?: [number, number]) => [number, number] | number
};

/*
For now, this only allows for a single, primary device

todo:
- option to specify device by index/pointerId
- option to filter by device type
- how do we handle multiple pointers at a time, like touch?
  https://devdocs.io/dom/pointer_events/multi-touch_interaction
  `navigator.maxTouchPoints`
- pinch/zoom
  https://devdocs.io/dom/pointer_events/pinch_zoom_gestures
- detect available devices (static method?)
- we could certainly use adjustable sensitivity/scaling values
  or I guess that could be done by a Processor
*/

interface PointerDeviceOptions extends ThrottledDeviceOptions {
	element: HTMLElement;
	touch: boolean;
	pen: boolean;
	mouse: boolean;
	touchActionStyle: boolean;
}

/**
 * A Pointer device driven by the [Pointer Events API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
 * and supporting multiple pointer types: mouse, touch or pen.
 *
 * Input is throttled to the `updatePeriod` given the constructor options,
 * which defaults to 1 / 60th of a second.
 *
 * Currently, only a single pointer is handled at a time, i.e. the first finger
 * to touch.
 */
export default class Pointer extends ThrottledDevice {
	readonly pointerType: 'pen' | 'mouse' | 'touch' | '';

	declare getControl: {
		/** Two-dimensional vectors */
		(name: keyof typeof controlDefs, options?: Vector2InputControlOptions): Vector2InputControl;

		/** Pointer device buttons */
		(name: keyof typeof buttonNameDefs, options?: ButtonInputControlOptions): ButtonInputControl;

		/** Normalized pressure of the [pointer](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure) input */
		(name: 'pressure', options?: InputControlOptions<number>): AxisInputControl;

		/** Two-dimensional change in pointer 'wheel', typically on a mouse or touchpad */
		(name: 'wheel', options?: Vector2InputControlOptions): Vector2InputControl;
	};

	constructor(options: Partial<PointerDeviceOptions> = {}) {
		super();

		const {
			updatePeriod = 1000 / 60,
			element = document.body,
			touch = true,
			pen = true,
			mouse = true,
			touchActionStyle = true
		} = options;

		let {
			enabled = true
		} = options;

		let previousEvent: PointerEvent = null;
		let lastEvent: PointerEvent = null;
		let lastWheelEvent: WheelEvent = null;

		const allowedPointerTypes = {
			pen,
			mouse,
			touch
		};

		const buttonsDown = new Set();

		const saveEvent = (evt: PointerEvent) => {
			if (enabled && evt.isPrimary && allowedPointerTypes[evt.pointerType]) {
				if (lastEvent && (!previousEvent || lastEvent.timeStamp - previousEvent.timeStamp >= updatePeriod)) {
					previousEvent = lastEvent;
				}
				lastEvent = evt;

				for (let i = 0; i < buttonDefs.length; i++) {
				/* eslint-disable no-bitwise */
					const mask = 1 << i;
					const buttonDown = evt.buttons & mask;
					/* eslint-enable no-bitwise */
					const name = getButtonName(evt, i);
					if (buttonDown) {
						buttonsDown.add(name);
					} else {
						buttonsDown.delete(name);
					}
				}

				this.emit('change');
			}
		};

		const onPointerOut = () => {
			lastEvent = previousEvent = null;
		};

		const onWheel = (evt: WheelEvent) => {
			lastWheelEvent = evt;
		};

		function readButton(name: string) {
			return buttonsDown.has(name.toLowerCase());
		}

		const styleElement = touchActionStyle && element.style ? element : document.body;
		if (touchActionStyle) {
			styleElement.style.touchAction = 'none';
		}

		function enable() {
			enabled = true;
			window.addEventListener('pointerdown', saveEvent);
			window.addEventListener('pointerup', saveEvent);
			window.addEventListener('pointermove', saveEvent);
			window.addEventListener('pointerout', onPointerOut);
			window.addEventListener('wheel', onWheel);
		}

		function disable() {
			enabled = false;
			previousEvent = null;
			lastEvent = null;
			lastWheelEvent = null;

			if (touchActionStyle) {
			// todo: only if it wasn't set before
				styleElement.style.touchAction = '';
			}

			buttonsDown.clear();
			window.removeEventListener('pointerdown', saveEvent);
			window.removeEventListener('pointerup', saveEvent);
			window.removeEventListener('pointermove', saveEvent);
			window.removeEventListener('pointerout', onPointerOut);
			window.removeEventListener('wheel', onWheel);
		}

		this.getControl = (name: string, options = {}) => {
			const controlSpec = name === 'pressure' ? pressure : controlDefs[name] as ControlDef;
			if (controlSpec) {
				const {
					constructor: ControlConstructor,
					reader
				} = controlSpec;

				const read = () => lastEvent ?
					reader(lastEvent, previousEvent, ControlConstructor.defaultValue) :
					ControlConstructor.defaultValue;

				return new ControlConstructor(read, Object.assign({
					name
				}, options, {
					device: this
				}));
			}

			if (buttonNames.has(name)) {
				return new ButtonInputControl(boolAsNum(() => readButton(name)), Object.assign({
					name
				}, options, {
					device: this
				}));
			}

			/*
			According to the spec, delta values can vary by deltaMode, but
			it seems that all browsers currently report values in pixels
			*/
			if (name === 'wheel') {
				return new Vector2InputControl(
					() => {
						if (lastWheelEvent && performance.now() - lastWheelEvent.timeStamp > updatePeriod) {
							lastWheelEvent = null;
						}
						return lastWheelEvent ?
							[lastWheelEvent.deltaX, lastWheelEvent.deltaY] :
							Vector2InputControl.defaultValue;
					},
					Object.assign({
						name
					}, options, {
						device: this
					})
				);
			}

			throw new Error('Control not found');
		};

		this.destroy = () => {
			disable();
		};

		Object.defineProperties(this, {
			pointerType: {
				get: () => lastEvent && lastEvent.pointerType || ''
			},

			// assume pointer is always connected?
			// ...not necessarily
			connected: {
				enumerable: false,
				configurable: false,
				writable: false,
				value: true
			},

			timestamp: {
				get: () => lastEvent && lastEvent.timeStamp || 0
			},

			enabled: {
				get: () => enabled,
				set(val) {
					if (!!val !== !!enabled) {
						if (val) {
							enable();
						} else {
							disable();
						}
					}
				}
			}
		});

		if (enabled) {
			enable();
		}
	}
}