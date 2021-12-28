import Vector2InputControl, { Vector2InputControlOptions } from './Vector2InputControl';
import ButtonInputControl, { ButtonInputControlOptions } from './ButtonInputControl';
import stickDeadZone from '../processors/stickDeadZone';

function getChildValue(read: () => number[], axis: number, neg: boolean) {
	const vec = read();
	const rawAxisValue = vec[axis];
	return Math.max(0, neg ? -rawAxisValue : rawAxisValue);
}

function makeChild(parent: StickInputControl, name: string, axis: number, negative: boolean, options: ButtonInputControlOptions) {
	const opts = Object.assign({}, options && options[name], {
		parent
	});
	parent[name] = new ButtonInputControl(() => getChildValue(parent.read, axis, negative), opts);

	parent.children.set(name, parent[name]);
}

const childbuttons = [
	['left', 0, true],
	['right', 0, false],
	['down', 1, true],
	['up', 1, false]
] as [string, number, boolean][];

export default class StickInputControl extends Vector2InputControl {
	constructor(read: (() => [number, number]) | Vector2InputControlOptions, options?: Vector2InputControlOptions) {
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
