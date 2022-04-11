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
		parent,
		device: parent.device
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

export type StickInputControlOptions = Vector2InputControlOptions & ButtonInputControlOptions;

export default class StickInputControl extends Vector2InputControl {
	constructor(read: (() => [number, number]) | StickInputControlOptions, options?: StickInputControlOptions) {
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

		const onChange = () => this.emit('change');
		this.children.forEach(child => {
			child.on('change', onChange);
		});
	}
}
