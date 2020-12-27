import Vector2InputControl from './Vector2InputControl';

export default class DPadInputControl extends Vector2InputControl {
	constructor({
		left,
		right,
		up,
		down,
		...opts
	}) {
		const read = () => {
			const x = right.read() - left.read();
			const y = up.read() - down.read();
			return [x, y];
		};
		super(read, opts);

		this.children.set('left', left);
		this.children.set('right', right);
		this.children.set('up', up);
		this.children.set('down', down);
	}
}
