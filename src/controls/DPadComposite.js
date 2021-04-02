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
