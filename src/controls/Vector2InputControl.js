import InputControl from './InputControl';
import AxisInputControl from './AxisInputControl';

export default class Vector2InputControl extends InputControl {
	static defaultValue = [0, 0];

	constructor(read, options) {
		if (read && typeof read === 'object' && !options) {
			options = read;
			read = null;
		}

		super(read, options);

		this.vector2 = this.read;
		this.x = new AxisInputControl(() => this.read()[0], Object.assign({}, options && options.x, {
			parent: this
		}));

		// i don't know why this is negative, but it is
		this.y = new AxisInputControl(() => this.read()[1], Object.assign({}, options && options.y, {
			parent: this
		}));
		this.children.set('x', this.x);
		this.children.set('y', this.x);
	}

	magnitude(vec = this.read()) {
		return Math.hypot(vec[0], vec[1]);
	}

	active() {
		const vec = this.read();
		return vec[0] !== 0 || vec[1] !== 0;
	}
}
