import AxisInputControl from './AxisInputControl';
import copyOptions from '../util/copyOptions';

export default class ButtonInputControl extends AxisInputControl {
	pressPoint = 0.5;
	constructor(read, opts) {
		super(read, opts);
		copyOptions(this, opts);
	}

	pressed(value = this.magnitude()) {
		return value >= this.pressPoint;
	}
}
