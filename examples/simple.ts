import html from 'html-loader!./simple.html';
import Gamepad from '../src/devices/Gamepad';
import Keyboard from '../src/devices/Keyboard';
import DPadComposite from '../src/controls/DPadComposite';
import AxisComposite from '../src/controls/AxisComposite';
import Action from '../src/Action';
import VirtualStick from '../src/devices/VirtualStick';
import domView from '../src/devices/virtualstick/domView';

document.body.innerHTML = html;

/**
 * Devices
 */
const gamepad = new Gamepad();
const kbd = new Keyboard({
	/*
	`keyCode` option makes this work on different layouts so WASD becomes
	ZQSD on "AZERTY" (e.g., French) keyboards.
	*/
	keyCode: true
});
const leftTouch = new VirtualStick({
	// constrain to left side of screen
	filter: evt => evt.pageX < Math.max(200, window.innerWidth * 0.4)
});
const rightTouch = new VirtualStick({
	// constrain to right side of screen
	filter: evt => evt.pageX > window.innerWidth - Math.max(200, window.innerWidth * 0.4)
});

/**
 * Controls
 */
const leftStick = gamepad.getControl('leftStick');
const rightStickHoriz = gamepad.getControl('rightStick').x;

const kbdWASD = new DPadComposite({
	up: kbd.getControl('KeyW'),
	left: kbd.getControl('KeyA'),
	down: kbd.getControl('KeyS'),
	right: kbd.getControl('KeyD')
});

const rotateArrowKeys = new AxisComposite({
	negative: kbd.getControl('ArrowLeft'),
	positive: kbd.getControl('ArrowRight')
});

const leftTouchStick = leftTouch.getControl();
const rightTouchStick = rightTouch.getControl();

/**
 * Actions
 */
const moveAction = new Action({
	bindings: [
		leftStick,
		kbdWASD,
		leftTouchStick
	]
});

const rotateAction = new Action({
	bindings: [
		rightStickHoriz,
		rotateArrowKeys,
		rightTouchStick.x
	]
});

const thing = document.getElementById('thing');

const speed = 300 / 1000; // pixels per 1000ms
const rotSpeed = 420 / 1000; // degrees per 1000ms
let x = 100;
let y = 100;
let r = 0;

let last = performance.now();
function update(t = performance.now()) {
	const delta = t - last;
	last = t;

	// gamepad is a polling device and won't work unless we update on every frame
	gamepad.update();

	const [dx, dy] = moveAction.value;
	const dr = rotateAction.value;

	const motionScale = speed * delta;
	x += dx * motionScale;
	y -= dy * motionScale;

	r += dr * rotSpeed * delta;

	// render
	thing.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
	requestAnimationFrame(update);
}

// visualize virtual sticks
domView(leftTouchStick);
domView(rightTouchStick);

update();
