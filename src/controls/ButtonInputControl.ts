import AxisInputControl from './AxisInputControl';
import copyOptions from '../util/copyOptions';
import { InputControlOptions } from './InputControl';

export interface ButtonInputControlOptions extends InputControlOptions<number> {
	pressPoint?: number;
}

export default class ButtonInputControl extends AxisInputControl {
	pressPoint = 0.5;

	constructor(read: (() => number) | ButtonInputControlOptions, options?: ButtonInputControlOptions) {
		if (read && typeof read === 'object' && !options) {
			options = read;
			read = null;
		}

		super(read, options);
		copyOptions(this, options);
	}

	pressed(value = this.magnitude()) {
		return value >= this.pressPoint;
	}
}
