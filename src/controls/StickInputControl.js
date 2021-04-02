import Vector2InputControl from './Vector2InputControl';
import ButtonInputControl from './ButtonInputControl';
import stickDeadZone from '../processors/stickDeadZone';

function getChildValue(read, axis, neg) {
	const vec = read();
	const rawAxisValue = vec[axis];
	const mag = Math.abs(neg ? -rawAxisValue : rawAxisValue);
	return Math.max(0, mag);
}

function makeChild(parent, name, axis, negative, options) {
	const opts = Object.assign({}, options && options[name], {
		parent
	});
	parent[name] = new ButtonInputControl(() => getChildValue(axis, negative), opts);

	parent.children.set(name, parent[name]);
}

const childbuttons = [
	['left', 0, true],
	['right', 0, false],
	['down', 1, true],
	['up', 1, false]
];

export default class StickInputControl extends Vector2InputControl {
	constructor(read, options) {
		if (read && typeof read === 'object' && !options) {
			options = read;
			read = null;
		}

		super(read, Object.assign(
			{
				processors: [stickDeadZone]
			},
			options
		));

		childbuttons.forEach(([name, axis, negative]) => {
			makeChild(this, name, axis, negative, options);
		});
	}
}
