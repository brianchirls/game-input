import Gamepad from './Gamepad';
const POLL_PERIOD = 1 / 60;

const gamepads = [];
const listeners = new Map();

function addGamepad(device) {
	const index = device && device.index;
	if (isNaN(index)) {
		return null;
	}
	if (!gamepads[index]) {
		const gamepad = new Gamepad(device, index);
		// gamepad.start();
		gamepads[index] = gamepad;
		listeners.forEach(({onConnected}) => onConnected(gamepad));
	}
	return gamepads[index] || null;
}

function removeGamepad(index) {
	const gamepad = index >= 0 && gamepads[index];
	if (gamepad) {
		gamepads[index] = undefined;
		listeners.forEach(({onDisconnected}) => onDisconnected(gamepad));
		gamepad.destroy();
	}
}

function onGamepadConnected(evt) {
	const gamepad = addGamepad(evt && evt.gamepad);
	if (gamepad) {
		poll();
	}
}

function onGamepadDisconnected(evt) {
	removeGamepad(evt && evt.gamepad && evt.gamepad.index);
}

let timeout = 0;
function poll() {
	clearTimeout(timeout);
	let found = false;

	const devices = navigator.getGamepads();
	for (let i = 0; i < devices.length; i++) {
		const device = devices[i];
		const gamepad = device && addGamepad(device);
		if (gamepad) {
			found = true;
			gamepad.poll(device);
		}
	}

	if (found) {
		timeout = setTimeout(poll, POLL_PERIOD);
	}
}

function start() {
	window.addEventListener('gamepadconnected', onGamepadConnected);
	window.addEventListener('gamepaddisconnected', onGamepadDisconnected);
	poll();
}

function end() {
	clearTimeout(timeout);
	gamepads.forEach(gamepad => {
		removeGamepad(gamepad && gamepad.index);
	});
	window.addEventListener('gamepadconnected', onGamepadConnected);
	window.addEventListener('gamepaddisconnected', onGamepadDisconnected);
}

// todo: make a new Gamepad instance for each device/listener
function registerListener({
	onConnected,
	onDisconnected
	// ...options
}) {

	const listener = Symbol();
	if (!listeners.size) {
		start();
	}
	listeners.set(listener, {
		onConnected,
		onDisconnected
	});
	gamepads.forEach(onConnected);

	return function release() {
		gamepads.forEach(onDisconnected);

		listeners.delete(listener);
		if (!listeners.size) {
			end();
		}
	};
}

export default registerListener;
