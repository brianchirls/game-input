import { Device, DeviceEvents } from '../Device';
import InputControl, { InputControlOptions } from './InputControl';

export default class AxisInputControl<DeviceType extends Device = Device<DeviceEvents>> extends InputControl<number, DeviceType> {
	axis: () => number;
	constructor(read: (() => number) | InputControlOptions<number, DeviceType>, options: InputControlOptions<number, DeviceType>) {
		if (read && typeof read !== 'function' && !options) {
			options = read;
			read = null;
		}

		super(<(() => number)>read, options);
		this.axis = this.read;
	}
}
