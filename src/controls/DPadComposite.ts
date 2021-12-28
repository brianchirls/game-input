import AxisInputControl from './AxisInputControl';
import Vector2InputControl, { Vector2InputControlOptions } from './Vector2InputControl';

interface DPadInputControlOptions extends Vector2InputControlOptions {
	left: AxisInputControl;
	right: AxisInputControl;
	up: AxisInputControl;
	down: AxisInputControl;
}

export default class DPadComposite extends Vector2InputControl {
	constructor({
		left,
		right,
		up,
		down,
		...opts
	}: DPadInputControlOptions) {
		const read: () => [number, number] = () => {
			const x = this.children.get('right').read() - this.children.get('left').read();
			const y = this.children.get('up').read() - this.children.get('down').read();
			return [x, y];
		};
		super(read, opts);

		this.children.set('left', left);
		this.children.set('right', right);
		this.children.set('up', up);
		this.children.set('down', down);
	}
}
