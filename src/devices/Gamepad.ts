import {
	buttons,
	buttonIndexes,
	sticks
} from './gamepad/controlMap';
import ButtonInputControl, { ButtonInputControlOptions } from '../controls/ButtonInputControl';
import StickInputControl, { StickInputControlOptions } from '../controls/StickInputControl';
import AxisInputControl from '../controls/AxisInputControl';
import { InputControlOptions } from '../controls/InputControl';
import { DeviceEvents, PollingDevice, ThrottledDeviceOptions } from '../Device';
import { WildcardHandler } from 'mitt';

const standardControlNames = new Set(buttons);
sticks.forEach(n => standardControlNames.add(n));

// todo: make this actually use InputControl
type InputControlConstructor = InstanceType<any>;
// type InputControlConstructor = {
// 	new (): InputControl
// };
type DeviceReader = (device: any, index: number) => any

const readers = new Map<InputControlConstructor, DeviceReader>([
	[ButtonInputControl, (device, buttonIndex) => device.buttons[buttonIndex].value],
	[StickInputControl, (device, leftAxisIndex) => [
		device.axes[leftAxisIndex],
		-device.axes[leftAxisIndex + 1]
	]],
	[AxisInputControl, (device, axisIndex) => device.axes[axisIndex]]
]);

type GamepadEvents = DeviceEvents & {
	connected: undefined;
	disconnected: undefined;
}

export interface GamepadOptions extends ThrottledDeviceOptions {
	index?: number;
}

/**
 * Emitted when a Gamepad device is connected.
 * @event
 */
export type OnConnected = () => void;

/**
 * Available options depend on which control is requested.
 */
export type GamepadGetControlOptions = Omit<ButtonInputControlOptions | StickInputControlOptions | InputControlOptions<number>, 'device' | 'children'>;

/**
 * A Device driven by the [Web Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API).
 *
 * Currently a [Standard Gamepad mapping](https://w3c.github.io/gamepad/#dfn-standard-gamepad) is assumed.
 *
 * Note that since the Gamepad API does not currently support change events,
 * this is a polling device and therefore requires calling `.update()` repeatedly
 * to update values and emit change events.
 */
export default class Gamepad extends PollingDevice<GamepadEvents> {
	declare getControl: {
		/** Two-dimensional stick inputs */
		(name: 'leftStick' | 'rightStick', options?: GamepadGetControlOptions): StickInputControl;

		/** One-dimensional, single axis of each stick */
		(name: 'leftStickX' | 'leftStickY' | 'rightStickX' | 'rightStickY', options?: GamepadGetControlOptions): AxisInputControl;

		/** Buttons. Some provide partial, "analog" values while others are either pressed or not. */
		(name: keyof typeof buttonIndexes, options?: GamepadGetControlOptions): ButtonInputControl;
	};

	/** [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad) object */
	readonly device: globalThis.Gamepad;

	/**
	 * A string containing some information about the controller, provided
	 * by the browser. Empty if no Gamepad device has been connected.
	 */
	readonly id: string;

	/**
	 * returns an Iterable of available control names.
	 */
	controls: () => IterableIterator<string>;

	declare on: {
		(type: 'connected', handler: OnConnected): void;

		/**
		 * Emitted when the Gamepad device is disconnected.
		 * @event
		 */
		(type: 'disconnected', handler: () => void): void;

		(type: '*', handler: WildcardHandler<GamepadEvents>): void;
	};

	constructor(options: GamepadOptions = {}) {
		const {
			updatePeriod = 1000 / 120,
			index = 0
		} = options;
		let {
			enabled = true
		} = options;

		super();

		const controlDefs = new Map<string, InputControlConstructor>();
		const controlIndices = new Map();
		let lastDevice: globalThis.Gamepad = null;
		let lastDeviceUpdate = 0;

		buttons.forEach((buttonName, i) => {
			controlDefs.set(buttonName, ButtonInputControl);
			controlIndices.set(buttonName, i);
		});

		sticks.forEach((stickName, i) => {
			controlDefs.set(stickName, StickInputControl);
			controlIndices.set(stickName, i * 2);
		});

		const update = () => {
			if (enabled) {
				const device = navigator.getGamepads()[index];
				const timestamp = device && device.timestamp || performance.now();
				if (device && timestamp - lastDeviceUpdate >= updatePeriod) {
					lastDevice = device;
					lastDeviceUpdate = timestamp;
					this.emit('change');
				}
			}
		};

		function connectGamePad(gp: globalThis.Gamepad) {
			if (gp) {
				update();

				// set any additional buttons or axes
				for (let i = buttons.length; i < gp.buttons.length; i++) {
					const name = 'button' + i;
					controlDefs.set(name, ButtonInputControl);
					controlIndices.set(name, i);
				}

				for (let i = 4; i < gp.axes.length; i++) {
					const name = 'axis' + i;
					controlDefs.set(name, AxisInputControl);
					controlIndices.set(name, i);
				}
			}
		}

		function disconnectGamepad() {
			// remove any extra controls
			controlDefs.forEach((def, key) => {
				if (!standardControlNames.has(key)) {
					controlDefs.delete(key);
					controlIndices.delete(key);
				}
			});
		}

		const onConnected = (evt: GamepadEvent) => {
			const gp = evt.gamepad;
			if (gp.index === index) {
				connectGamePad(gp);

				this.emit('connected');
			}
		};

		const onDisconnected = (evt: GamepadEvent) => {
			const gp = evt.gamepad;
			if (gp.index === index) {
				disconnectGamepad();

				this.emit('disconnected');
			}
		};

		this.getControl = (name: string, options?: GamepadGetControlOptions) => {
			const ControlConstructor = controlDefs.get(name);
			if (!ControlConstructor) {
				throw new Error('Control not found');
			}

			const reader = readers.get(ControlConstructor);
			const index = controlIndices.get(name);
			const read = () => {
				update();
				return lastDevice ?
					reader(lastDevice, index) :
					ControlConstructor.defaultValue;
			};

			return new ControlConstructor(read, Object.assign({
				name
			}, options, {
				device: this,
				children: null
			}));
		};

		this.controls = () => controlDefs.keys();

		this.update = update;

		const destroyEventEmitter = this.destroy;
		this.destroy = () => {
			destroyEventEmitter();
			window.removeEventListener('gamepadconnected', onConnected);
			window.removeEventListener('gamepaddisconnected', onDisconnected);
		};

		Object.defineProperties(this, {
			device: {
				get: () => lastDevice
			},
			id: {
				get: () => lastDevice && lastDevice.id || ''
			},
			connected: {
				get: () => !!lastDevice && lastDevice.connected
			},
			timestamp: {
				get: () => lastDeviceUpdate
			},
			enabled: {
				get: () => enabled,
				set(val) {
					enabled = !!val;
				}
			}
		});

		update();
		window.addEventListener('gamepadconnected', onConnected);
		window.addEventListener('gamepaddisconnected', onDisconnected);
	}
}
