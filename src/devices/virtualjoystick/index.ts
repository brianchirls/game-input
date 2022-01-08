import StickInputControl, { StickInputControlOptions } from '../../controls/StickInputControl';
import { Device, DeviceOptions } from '../Device';

type VirtualJoystickMode = 'dynamic' | 'static';

interface VirtualJoystickOptions extends DeviceOptions {
	element: HTMLElement;
	radius: number;
	x: number;
	y: number;
	mode: VirtualJoystickMode;
	lockX: boolean;
	lockY: boolean;
	touch: boolean;
	pen: boolean;
	mouse: boolean;
	filter: (evt: PointerEvent) => boolean;
	touchActionStyle: boolean;
	enabled: boolean;
}

export default class VirtualJoystick implements Device {
	getControl: (name: string, options?: StickInputControlOptions) => StickInputControl;
	destroy: () => void;
	x: number;
	y: number;
	radius: number;
	enabled: boolean;
	readonly pointerType: string;
	readonly mode: VirtualJoystickMode;
	readonly connected: boolean;
	readonly timestamp: number;
	readonly element: HTMLElement;

	constructor(options: Partial<VirtualJoystickOptions> = {}) {
		const {
			element = document.body,
			mode = 'dynamic',
			lockX = false,
			lockY = false,
			touch = true,
			pen = true,
			mouse = false,
			filter = null,
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

		function pointerMove(evt: PointerEvent) {
			if (startEvent && startEvent.pointerId === evt.pointerId) {
				lastEvent = evt;

				// calculate and set x/y
				const dx = lockX ? 0 : evt.offsetX - startX;
				const dy = lockY ? 0 : evt.offsetY - startY;
				const length = Math.hypot(dx, dy);

				const divisor = Math.max(length, radius);
				deltaX = dx / divisor;
				deltaY = -dy / divisor;
			}
		}

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
				{},
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
