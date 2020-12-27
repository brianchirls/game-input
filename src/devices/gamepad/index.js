import {
	buttons,
	sticks
} from './controlMap';
import ButtonInputControl from '../../controls/ButtonInputControl';
import StickInputControl from '../../controls/StickInputControl';
import AxisInputControl from '../../controls/AxisInputControl';
import eventEmitter from '../../util/eventEmitter';

const standardControlNames = new Set(buttons);
sticks.forEach(n => standardControlNames.add(n));

const readers = new Map([
	[ButtonInputControl, (device, buttonIndex) => device.buttons[buttonIndex].value],
	[StickInputControl, (device, leftAxisIndex) => [
		device.axes[leftAxisIndex],
		-device.axes[leftAxisIndex + 1]
	]],
	[AxisInputControl, (device, axisIndex) => device.axes[axisIndex]]
]);

export default function Gamepad(index = 0, {
	updatePeriod = 1000 / 120
} = {}) {
	const clearEvents = eventEmitter(this);

	const controlDefs = new Map();
	const controlIndices = new Map();
	let lastDevice = null;
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
		const device = navigator.getGamepads()[index];
		const timestamp = device && device.timestamp || performance.now();
		if (device && timestamp - lastDeviceUpdate >= updatePeriod) {
			lastDevice = device;
			lastDeviceUpdate = timestamp;
		}
	}

	const onConnected = evt => {
		const gp = evt.gamepad;
		if (gp.index === index) {
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

			this.emit('connected');
		}
	};

	const onDisconnected = evt => {
		const gp = evt.gamepad;
		if (gp.index === index) {
			// remove any extra controls
			controlDefs.forEach((def, key) => {
				if (!standardControlNames.has(key)) {
					controlDefs.delete(key);
					controlIndices.delete(key);
				}
			});

			this.emit('disconnected');
		}
	};

	this.getControl = (name, options) => {
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

	this.destroy = () => {
		clearEvents();
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
		}
	});

	update();
	window.addEventListener('gamepadconnected', onConnected);
	window.addEventListener('gamepaddisconnected', onDisconnected);
}
