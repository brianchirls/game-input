import InputControl from './InputControl';

export default class AxisInputControl extends InputControl {
	constructor(read, options) {
		if (read && typeof read === 'object' && !options) {
			options = read;
			read = null;
		}

		super(read, options);
		this.axis = this.read;
	}
}
