import {
	buttons,
	sticks
} from './controlMap';
import ButtonInputControl from '../../controls/ButtonInputControl';
import StickInputControl from '../../controls/StickInputControl';
import AxisInputControl from '../../controls/AxisInputControl';
import EventEmitter from '../../util/EventEmitter';
import { InputControlBase } from '../../controls/InputControl';
import { PollingDevice, PollingDeviceOptions } from '../Device';

const standardControlNames = new Set(buttons);
sticks.forEach(n => standardControlNames.add(n));

// todo: make this actually use InputControlBase
type InputControlConstructor = InstanceType<any>;
// type InputControlConstructor = {
// 	new (): InputControlBase
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

type GamepadEvents = {
	connected: unknown;
	disconnected: unknown;
}

interface GamepadOptions extends PollingDeviceOptions {
	index: number;
}

export default class Gamepad extends EventEmitter<GamepadEvents> implements PollingDevice {
	getControl: (name: string, options?: any) => InputControlBase;
	controls: () => IterableIterator<string>;
	enabled: boolean;
	readonly connected: boolean;
	readonly timestamp: number;
	readonly device: globalThis.Gamepad;
	readonly id: string;

	constructor(options: Partial<GamepadOptions> = {}) {
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

		function update() {
			if (enabled) {
				const device = navigator.getGamepads()[index];
				const timestamp = device && device.timestamp || performance.now();
				if (device && timestamp - lastDeviceUpdate >= updatePeriod) {
					lastDevice = device;
					lastDeviceUpdate = timestamp;
				}
			}
		}

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

		this.getControl = (name: string, options: any) => {
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
				device: this
			}));
		};

		this.controls = () => controlDefs.keys();

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
				get: () => lastDevice && lastDevice.id || null
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
