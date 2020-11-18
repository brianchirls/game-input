import ButtonInputControl from '../../controls/ButtonInputControl';
import AxisInputControl from '../../controls/AxisInputControl';
import Vector2InputControl from '../../controls/Vector2InputControl';
import boolAsNum from '../../util/boolAsNum';

const buttonDefs = [
	{
		mouse: 'leftMouseButton',
		touch: 'touch',
		pen: 'penTip'
	},
	{
		mouse: 'middleMouseButton'
	},
	{
		mouse: 'rightMouseButton',
		pen: 'penBarrelButton'
	},
	{
		mouse: 'mouseBackButton'
	},
	{
		mouse: 'mouseForwardButton'
	},
	{
		pen: 'penEraser'
	}
];

const buttonNames = new Set();
buttonDefs.forEach(def => {
	for (const buttonName of Object.values(def)) {
		buttonNames.add(buttonName);
	}
});

function getButtonName(evt, buttonIndex = evt.button) {
	if (buttonIndex >= 0 && buttonIndex < buttonDefs.length && evt.isPrimary) {
		const def = buttonDefs[buttonIndex];
		return def[evt.pointerType] || '';
	}

	return '';
}

const controlDefs = {
	position: {
		constructor: Vector2InputControl,
		reader: evt => [evt.x, evt.y]
	},
	pagePosition: {
		constructor: Vector2InputControl,
		reader: evt => [evt.pageX, evt.pageY]
	},
	screenPosition: {
		constructor: Vector2InputControl,
		reader: evt => [evt.screenX, evt.screenY]
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
		reader: (evt, previousEvent, defaultValue) => previousEvent ?
			[evt.x - previousEvent.x, evt.y - previousEvent.y] :
			defaultValue
	},
	pageDelta: {
		constructor: Vector2InputControl,
		reader: (evt, previousEvent, defaultValue) => previousEvent ?
			[evt.pageX - previousEvent.pageX, evt.pageY - previousEvent.pageY] :
			defaultValue
	},
	screenDelta: {
		constructor: Vector2InputControl,
		reader: (evt, previousEvent, defaultValue) => previousEvent ?
			[evt.screenX - previousEvent.screenX, evt.screenY - previousEvent.screenY] :
			defaultValue
	},
	pressure: {
		constructor: AxisInputControl,
		reader: evt => evt.pressure || 0
	}
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

export default function Pointer({
	updatePeriod = 1000 / 60
} = {}) {
	let previousEvent = null;
	let lastEvent = null;
	let lastWheelEvent = null;

	const buttonsDown = new Set();

	const saveEvent = evt => {
		if (evt.isPrimary) {
			previousEvent = lastEvent;
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
		}
	};

	const onWheel = evt => {
		lastWheelEvent = evt;
	};

	function update() {
		if (lastEvent && performance.now() - lastEvent.timeStamp > updatePeriod) {
			previousEvent = lastEvent;
		}

		if (lastWheelEvent && performance.now() - lastWheelEvent.timeStamp > updatePeriod) {
			lastWheelEvent = null;
		}
	}

	function readButton(name) {
		return buttonsDown.has(name.toLowerCase());
	}

	this.getControl = (name, options = {}) => {
		const controlSpec = controlDefs[name];
		if (controlSpec) {
			const {
				constructor: ControlConstructor,
				reader
			} = controlSpec;

			const read = () => {
				update();
				return lastEvent ?
					reader(lastEvent, previousEvent, ControlConstructor.defaultValue) :
					ControlConstructor.defaultValue;
			};

			return new ControlConstructor(read, Object.assign({
				name
			}, options, {
				device: this
			}));
		}

		if (buttonNames.has(name)) {
			return new ButtonInputControl(boolAsNum(() => readButton(name)), Object.assign({
				name
			}, options));
		}

		/*
		According to the spec, delta values can vary by deltaMode, but
		it seems that all browsers currently report values in pixels
		*/
		if (name === 'wheel') {
			return new Vector2InputControl(
				() => {
					update();
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
		buttonsDown.clear();
		window.removeEventListener('pointerdown', saveEvent);
		window.removeEventListener('pointerup', saveEvent);
		window.removeEventListener('pointermove', saveEvent);
		window.removeEventListener('wheel', onWheel);
	};

	// assume pointer is always connected?
	// ...not necessarily
	Object.defineProperty(this, 'connected', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: true
	});

	Object.defineProperties(this, {
		pointerType: {
			get: () => lastEvent && lastEvent.pointerType || ''
		},
		connected: {
			enumerable: false,
			configurable: false,
			writable: false,
			value: true
		},
		timestamp: {
			get: () => lastEvent && lastEvent.timeStamp || 0
		}
	});

	window.addEventListener('pointerdown', saveEvent);
	window.addEventListener('pointerup', saveEvent);
	window.addEventListener('pointermove', saveEvent);
	window.addEventListener('wheel', onWheel);
}