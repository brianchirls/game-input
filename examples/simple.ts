import Gamepad from '../src/devices/gamepad';
import Keyboard from '../src/devices/keyboard';
import Pointer from '../src/devices/pointer';
import DPadComposite from '../src/controls/DPadComposite';
import AxisComposite from '../src/controls/AxisComposite';
import Action from '../src/Action';
import PressInteraction from '../src/interactions/PressInteraction';
import ReleaseInteraction from '../src/interactions/ReleaseInteraction';
import VirtualStick from '../src/devices/virtualstick';
import domView from '../src/devices/virtualstick/domView';
import { StickInputControl } from '../src';

// Devices
const gamepad = new Gamepad();
const kbd = new Keyboard({
	keyCode: true
});
const pointer = new Pointer({
	touch: false,
	enabled: false
});
const leftTouch = new VirtualStick({
	filter: evt => evt.pageX < Math.max(200, window.innerWidth * 0.4)
});
const rightTouch = new VirtualStick({
	filter: evt => evt.pageX > window.innerWidth - Math.max(200, window.innerWidth * 0.4)
});

// Controls
const leftStick = gamepad.getControl('leftStick') as StickInputControl;
// const downButton = leftStick.find('down');
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

// Actions
const moveAction = new Action<[number, number]>({
	bindings: [
		leftStick,
		kbdWASD,
		leftTouchStick,
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
		rightTouchStick.find('x'),
		pointer.getControl('wheel')
	]
});

const buttonAction = new Action({
	bindings: [kbd.getControl(' ')]
});

const pressButton = new PressInteraction(buttonAction);
pressButton.on('*', evtName => console.log('press interaction', evtName, pressButton.state));

const releaseButton = new ReleaseInteraction(buttonAction);
releaseButton.on('*', evtName => console.log('release interaction', evtName, releaseButton.state));

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

domView(leftTouchStick);
domView(rightTouchStick);

update();

// Toggle devices
const devices = [
	['Gamepad', gamepad],
	['Keyboard', kbd],
	['Pointer', pointer]
] as [string, { enabled: boolean; }][];

if (leftTouch.connected) {
	devices.push([
		'Virtual Stick',
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
