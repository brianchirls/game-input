import InputControl from './InputControl';

export default class AxisInputControl extends InputControl {
	constructor(read = () => 0, options) {
		super(read, options);
		this.axis = this.read;
	}
}
