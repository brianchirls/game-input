import InputControl, { InputControlOptions } from './InputControl';

export default class AxisInputControl extends InputControl<number> {
	axis: () => number;
	constructor(read: (() => number) | InputControlOptions<number>, options: InputControlOptions<number>) {
		if (read && typeof read !== 'function' && !options) {
			options = read;
			read = null;
		}

		super(<(() => number)>read, options);
		this.axis = this.read;
	}
}
