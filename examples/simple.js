import Gamepad from '../src/devices/gamepad';
import Keyboard from '../src/devices/keyboard';
import DPadComposite from '../src/controls/DPadComposite';
import AxisComposite from '../src/controls/AxisComposite';
import Action from '../src/Action';
import PressInteraction from '../src/interactions/PressInteraction';
import ReleaseInteraction from '../src/interactions/ReleaseInteraction';

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

const rotateArrowKeys = new AxisComposite({
	negative: kbd.getControl('arrowleft'),
	positive: kbd.getControl('arrowright')
});

const moveAction = new Action({
	bindings: [leftStick, kbdWASD]
});
const rotateAction = new Action({
	bindings: [rightStickHoriz, rotateArrowKeys]
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

	const meh = speed * delta;
	x += dx * meh;
	y -= dy * meh;

	r += dr * rotSpeed * delta;

	// render
	thing.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
	requestAnimationFrame(update);
}

update();
