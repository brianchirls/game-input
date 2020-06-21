import {
	buttons,
	axes
} from './controlMap';
import axisDeadZone from '../../processors/axisDeadZone';
import eev from 'eev';

const directions = ['+', '-'];
const CHANGE_THRESHOLD = 0.005;

// function GamepadClient(gamepad) {
// 	const events = {
// 		press: new Set(),
// 		release: new
// 	}
// 	this.on = gamepad.on;
// 	this.off = gamepad.off;
// }

// todo: optional processors in here, maybe probably
function Gamepad(device, index) {
	eev.call(this);

	this.index = index;
	this.id = device.id;
	// this.clients = new Set();

	const buttonStates = {};
	const axisValues = [];
	for (let i = 0; i < device.buttons.length; i++) {
		const key = buttons[i] || 'button' + i;
		buttonStates[key] = {
			pressed: false,
			touched: false,
			value: 0
			// todo: start time?, last update time?
		};
	}

	// set up virtual buttons for axes
	for (let i = 0; i < device.axes.length; i++) {
		axisValues[i] = 0;
		const key = axes[i] || 'axis' + i;
		directions.forEach(dir => {
			buttonStates[key + dir] = {
				pressed: false,
				touched: false,
				value: 0
				// todo: start time?, last update time?
			};
		});
	}

	const setButtonValue = (key, value, pressed = value > 0, touched = false) => {
		const state = buttonStates[key];
		const valueChanged = Math.abs(value - state.value) >= CHANGE_THRESHOLD;
		state.value = value;
		if (valueChanged) {
			this.emit('value', { button: key, value });
		}
		if (state.pressed !== pressed) {
			state.pressed = pressed;

			this.emit('button', { button: key, pressed });
			this.emit(pressed ? 'press' : 'release', { button: key });
		}
		if (state.touched !== touched) {
			state.touched = touched;
			this.emit('touch', { button: key, touched });
			this.emit(touched ? 'touchstart' : 'touchend', { button: key });
		}
	};

	this.poll = device => {
		for (let i = 0; i < device.buttons.length; i++) {
			const key = buttons[i] || 'button' + i;
			const button = device.buttons[i];
			const value = button.value || 0;
			setButtonValue(key, value, button.pressed, button.touched);
		}

		for (let i = 0; i < device.axes.length; i++) {
			const key = axes[i] || 'axis' + i;
			const axisValue = axisDeadZone(device.axes[i] || 0);
			const axisChanged = Math.abs(axisValue - axisValues[i]) >= CHANGE_THRESHOLD;
			axisValues[i] = axisValue;
			if (axisChanged) {
				this.emit('axis', { axis: key, value: axisValue });
			}

			directions.forEach((dir, neg) => {
				const value = Math.max(0, neg ? -axisValue : axisValue);
				setButtonValue(key + dir, value);
			});
		}
	};

	// this.getClient = () => {
	// 	cons
	// }

	// query button states/values
	this.pressed = key => !!(buttonStates[key] && buttonStates[key].pressed);
	this.touched = key => !!(buttonStates[key] && buttonStates[key].touched);
	this.value = key => !!(buttonStates[key] && buttonStates[key].value);
	this.axis = key => axisValues[key] || 0;

	this.destroy = () => {
		// todo: destroy any clients
		// todo: remove any event listeners
	};
}

Gamepad.prototype = Object.create(eev.prototype);

export default Gamepad;
