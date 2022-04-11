import InputControl, { InputControlOptions } from './InputControl';
import AxisInputControl from './AxisInputControl';

export interface Vector2InputControlOptions extends InputControlOptions<[number, number]> {
	x?: InputControlOptions<number>;
	y?: InputControlOptions<number>;
}

export default class Vector2InputControl extends InputControl<[number, number]> {
	static defaultValue = [0, 0] as [number, number];
	vector2: () => [number, number];
	x: AxisInputControl;
	y: AxisInputControl;

	constructor(read?: (() => [number, number]) | Vector2InputControlOptions, options?: Vector2InputControlOptions) {
		if (read && typeof read === 'object' && !options) {
			options = read;
			read = null;
		}

		const {
			x: xOptions,
			y: yOptions,
			...opts
		} = options || {};

		super(read, opts);

		this.vector2 = this.read;
		this.x = new AxisInputControl(
			() => this.read()[0],
			Object.assign({}, xOptions, {
				parent: this
			})
		);

		// i don't know why this is negative, but it is
		this.y = new AxisInputControl(
			() => this.read()[1],
			Object.assign({}, yOptions, {
				parent: this
			})
		);
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
