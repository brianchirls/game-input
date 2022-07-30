import StickInputControl, { StickInputControlOptions } from '../controls/StickInputControl';
import { Device, DeviceOptions } from '../Device';

export interface VirtualStickOptions extends DeviceOptions {
	/**
	 * HTML element on which pointer events are registered
	 * default: `document.body`
	 */
	element: HTMLElement;

	/**
	 * radius: maximum distance from center point, at which the control is fully extended
	 * default: `60`
	 */
	radius: number;

	/**
	 * horizontal position on screen of center point (pixels)
	 * default: `0`
	 */
	x: number;

	/**
	  * vertical position on screen of center point (pixels)
	  * default: `0`
	  */
	y: number;

	/**
	 * placement mode
	 * - dynamic: center position is wherever the pointer started
	 * - static: fixed center position, defined by `x` and `y`
	 * default: `'dynamic'`
	 */
	mode: 'dynamic' | 'static';

	/**
	 * If true, x value will always be zero. Used for vertical sliders.
	 * default: `false`
	 */
	lockX: boolean;

	/**
	 * If true, y value will always be zero. Used for horizontal sliders.
	 * default: `false`
	 */
	lockY: boolean;

	/**
	 * whether to respond to touch pointer events
	 * default: `true`
	 * */
	touch: boolean;

	/**
	 * whether to respond to pen pointer events
	 * default: `true`
	 * */
	pen: boolean;

	/**
	 * whether to respond to mouse pointer events
	 * default: `false`
	 * */
	mouse: boolean;

	/**
	 * A callback function that receives the `pointerdown` event
	 * and returns a boolean to determine whether to initiate
	 * the virtual stick.
	 *
	 * This may be used to restrict a virtual stick to a certain
	 * area of the screen or apply other constraints.
	 */
	filter: (evt: PointerEvent) => boolean;

	/**
	 * whether to set CSS `touch-action` to `'none'` on the element.
	 * This prevents other browser drag events, like text highlighting.
	 * default: `true`
	 */
	touchActionStyle: boolean;
}

/**
 * An on-screen virtual stick device.
 *
 * A single stick control is provided per virtual device, regardless of
 * the name given.
 */
export default class VirtualStick extends Device {
	/**
	 * Will always return a `StickInputControl`.
	 * Name set on the control but is otherwise ignored.
	 */
	declare getControl: (name?: string, options?: StickInputControlOptions) => StickInputControl;

	/**
	 * horizontal position on screen of center point (pixels)
	 */
	x: number;

	/**
	 * vertical position on screen of center point (pixels)
	 */
	y: number;

	/**
	 * radius: maximum distance from center point, at which the control is fully extended
	 */
	radius: number;

	/**
	 * Type of pointer currently or most recently activating the virtual stick.
	 * mouse, touch or pen
	 */
	readonly pointerType: string;

	/**
	 * placement mode
	 * - dynamic: center position is wherever the pointer started
	 * - static: fixed center position, defined by `x` and `y`
	 */
	readonly mode: 'dynamic' | 'static';

	/**
	 * time in milliseconds of the most recent change
	 */
	readonly timestamp: number;

	/**
	 * HTML element on which pointer events are registered
	 */
	readonly element: HTMLElement;

	constructor(options: Partial<VirtualStickOptions> = {}) {
		super();

		const {
			element = document.body,
			mode = 'dynamic',
			lockX = false,
			lockY = false,
			touch = true,
			pen = true,
			mouse = false,
			filter,
			touchActionStyle = true
		} = options;
		let {
			radius = 60,
			x = 0,
			y = 0,
			enabled = true
		} = options;

		let startEvent: PointerEvent = null;
		let lastEvent: PointerEvent = null;
		let startX = 0;
		let startY = 0;
		let deltaX = 0;
		let deltaY = 0;

		const isStatic = mode === 'static';
		const supported = mouse || pen || touch && navigator.maxTouchPoints > 0;

		const allowedPointerTypes = {
			pen,
			mouse,
			touch
		};

		/*
		For now, each device only handles one pointer at a time
		*/
		function pointerDown(evt: PointerEvent) {
			if (!startEvent &&
				allowedPointerTypes[evt.pointerType] && (!filter || filter(evt))) {

				if (isStatic) {
					const dx = evt.offsetX - x;
					const dy = evt.offsetY - y;
					if (Math.hypot(dx, dy) > radius) {
						return;
					}

					startX = x;
					startY = y;
				} else {
					startX = evt.offsetX;
					startY = evt.offsetY;
				}

				startEvent = evt;
				lastEvent = evt;
			}
		}

		const pointerMove = (evt: PointerEvent) => {
			if (startEvent && startEvent.pointerId === evt.pointerId) {
				lastEvent = evt;

				// calculate and set x/y
				const dx = lockX ? 0 : evt.offsetX - startX;
				const dy = lockY ? 0 : evt.offsetY - startY;
				const length = Math.hypot(dx, dy);

				const divisor = Math.max(length, radius);
				deltaX = dx / divisor;
				deltaY = -dy / divisor;

				this.emit('change');
			}
		};

		function pointerUp(evt: PointerEvent) {
			if (startEvent && startEvent.pointerId === evt.pointerId) {
				lastEvent = evt;
				startEvent = null;
			}
		}

		const styleElement = touchActionStyle && element.style ? element : document.body;

		function enable() {
			enabled = true;
			if (supported) {

				if (touchActionStyle) {
					styleElement.style.touchAction = 'none';
				}

				element.addEventListener('pointerdown', pointerDown);
				element.addEventListener('pointermove', pointerMove);
				element.addEventListener('pointerup', pointerUp);
				element.addEventListener('pointercancel', pointerUp);
			}
		}

		function disable() {
			enabled = false;
			if (touchActionStyle) {
				// todo: only if it wasn't set before
				styleElement.style.touchAction = '';
			}

			element.removeEventListener('pointerdown', pointerDown);
			element.removeEventListener('pointermove', pointerMove);
			element.removeEventListener('pointerup', pointerUp);
			element.removeEventListener('pointercancel', pointerUp);
		}

		this.getControl = (name, options?: StickInputControlOptions) => {
			// if (typeof options === 'string') {
			// 	throw new Error('VirtualJoystick accepts options object');
			// }
			const read = () => {
				return startEvent ?
					[deltaX, deltaY] as [number, number] :
					StickInputControl.defaultValue;
			};

			return new StickInputControl(read, Object.assign(
				{
					name
				},
				options,
				{
					device: this,
					active: () => !!startEvent
				}
			));
		};

		this.destroy = () => {
			disable();
		};

		Object.defineProperties(this, {
			pointerType: {
				get: () => lastEvent && lastEvent.pointerType || ''
			},

			mode: {
				get: () => mode
			},

			connected: {
				enumerable: false,
				configurable: false,
				writable: false,
				value: supported
			},

			timestamp: {
				get: () => lastEvent && lastEvent.timeStamp || 0
			},

			element: {
				enumerable: false,
				configurable: false,
				writable: false,
				value: element
			},

			x: {
				get: () => isStatic ? x : startX,
				set: val => {
					x = val;
				}
			},

			y: {
				get: () => isStatic ? y : startY,
				set: val => {
					y = val;
				}
			},

			radius: {
				get: () => radius,
				set: val => {
					radius = val;
				}
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
