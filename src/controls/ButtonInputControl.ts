import { Device } from '../Device';
import AxisInputControl from './AxisInputControl';
import { InputControlOptions } from './InputControl';

export interface ButtonInputControlOptions<DeviceType extends Device = Device<any>> extends InputControlOptions<number, DeviceType> {
	pressPoint?: number;
}

export default class ButtonInputControl<DeviceType extends Device = Device<any>> extends AxisInputControl<DeviceType> {
	pressPoint = 0.5;

	constructor(read: (() => number) | ButtonInputControlOptions<DeviceType>, options?: ButtonInputControlOptions<DeviceType>) {
		if (read && typeof read === 'object' && !options) {
			options = read;
			read = null;
		}

		super(read, options);
		if (options?.pressPoint !== undefined) {
			this.pressPoint = options?.pressPoint;
		}
	}

	pressed(value = this.magnitude()) {
		return value >= this.pressPoint;
	}
}
