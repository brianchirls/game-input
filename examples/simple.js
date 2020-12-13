import Gamepad from '../src/devices/gamepad';
import Keyboard from '../src/devices/keyboard';
import Pointer from '../src/devices/pointer';
import DPadComposite from '../src/controls/DPadComposite';
import AxisComposite from '../src/controls/AxisComposite';
import Action from '../src/Action';
import PressInteraction from '../src/interactions/PressInteraction';
import ReleaseInteraction from '../src/interactions/ReleaseInteraction';
import VirtualJoystick from '../src/devices/virtualjoystick';
import domView from '../src/devices/virtualjoystick/domView';

const gamepad = new Gamepad();
const leftStick = gamepad.getControl('leftStick');
// const downButton = leftStick.find('down');
const rightStickHoriz = gamepad.getControl('rightStick').find('x');

const kbd = new Keyboard();
const kbdWASD = new DPadComposite({
	up: kbd.getControl('W'),
	left: kbd.getControl('A'),
	down: kbd.getControl('S'),
	right: kbd.getControl('D')
});

const pointer = new Pointer({
	touch: false
});

const rotateArrowKeys = new AxisComposite({
	negative: kbd.getControl('arrowleft'),
	positive: kbd.getControl('arrowright')
});

const leftTouchJoystick = new VirtualJoystick({
	filter: evt => evt.pageX < Math.max(200, window.innerWidth * 0.4)
}).getControl();


const rightTouchJoystick = new VirtualJoystick({
	filter: evt => evt.pageX > window.innerWidth - Math.max(200, window.innerWidth * 0.4)
}).getControl();

const moveAction = new Action({
	bindings: [
		leftStick,
		kbdWASD,
		leftTouchJoystick,
		{
			control: pointer.getControl('delta'),
			processors: [
				vec => [
					vec[0] / 8,
					-vec[1] / 8
				]
			]
		}
	]
});
const rotateAction = new Action({
	bindings: [
		rightStickHoriz,
		rotateArrowKeys,
		rightTouchJoystick.find('x'),
		pointer.getControl('wheel')
	]
});

const buttonAction = new Action({
	bindings: [kbd.getControl(' ')],
	interactions: [
		new PressInteraction(),
		new ReleaseInteraction()
	]
});
// buttonAction.on('press', () => console.log('spacebar down'));
// buttonAction.on('release', () => console.log('spacebar up'));
buttonAction.on('completed', binding => console.log('interaction', binding));

const thing = document.createElement('div');
Object.assign(thing.style, {
	position: 'absolute',
	width: '30px',
	height: '60px',
	backgroundColor: 'rebeccapurple',
	margin: '-15px 30px'
});
document.body.appendChild(thing);

const speed = 300 / 1000; // pixels per 1000ms
const rotSpeed = 360 / 1000; // degrees per 1000ms
let x = 100;
let y = 100;
let r = 30;

let last = performance.now();
function update(t = performance.now()) {
	const delta = t - last;
	last = t;

	moveAction.update();
	rotateAction.update();
	buttonAction.update();

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

domView(leftTouchJoystick);
domView(rightTouchJoystick);

update();
