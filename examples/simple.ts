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
import { AxisInputControl, StickInputControl } from '../src';

// Devices
const gamepad = new Gamepad();
const kbd = new Keyboard();
const pointer = new Pointer({
	touch: false,
	enabled: false
});
const leftTouch = new VirtualJoystick({
	filter: evt => evt.pageX < Math.max(200, window.innerWidth * 0.4)
});
const rightTouch = new VirtualJoystick({
	filter: evt => evt.pageX > window.innerWidth - Math.max(200, window.innerWidth * 0.4)
});

// Controls
const leftStick = gamepad.getControl('leftStick') as StickInputControl;
// const downButton = leftStick.find('down');
const rightStickHoriz = gamepad.getControl('rightStick').find('x') as AxisInputControl;

const kbdWASD = new DPadComposite({
	up: kbd.getControl('W'),
	left: kbd.getControl('A'),
	down: kbd.getControl('S'),
	right: kbd.getControl('D')
});

const rotateArrowKeys = new AxisComposite({
	negative: kbd.getControl('arrowleft'),
	positive: kbd.getControl('arrowright')
});

const leftTouchJoystick = leftTouch.getControl();
const rightTouchJoystick = rightTouch.getControl();

// Actions
const moveAction = new Action<[number, number]>({
	bindings: [
		leftStick,
		kbdWASD,
		leftTouchJoystick,
		{
			control: pointer.getControl('delta'),
			processors: [
				(vec: [number, number]) => [
					vec[0] / 8,
					-vec[1] / 8
				] as [number, number]
			]
		}
	]
});
const rotateAction = new Action<number>({
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

// Toggle devices
const devices = [
	['Gamepad', gamepad],
	['Keyboard', kbd],
	['Pointer', pointer]
];

if (leftTouch.connected) {
	devices.push([
		'Virtual Joystick',
		{
			get enabled() {
				return leftTouch.enabled;
			},
			set enabled(val) {
				leftTouch.enabled = val;
				rightTouch.enabled = val;
			}
		}
	]);
}

const controls = document.createElement('div');
Object.assign(controls.style, {
	position: 'fixed',
	top: '20px',
	right: '20px',
	border: 'white solid 1px',
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	color: '#ffffff',
	display: 'flex',
	flexDirection: 'column',
	padding: '20px'
});
document.body.appendChild(controls);
devices.forEach(([name, device]) => {
	const label = document.createElement('label');
	const input = document.createElement('input');
	Object.assign(input, {
		type: 'checkbox',
		checked: device.enabled,
		onclick() {
			device.enabled = !device.enabled;
		}
	});

	label.appendChild(input);
	label.appendChild(document.createTextNode(' ' + name));

	controls.appendChild(label);
});