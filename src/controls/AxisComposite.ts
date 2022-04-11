import AxisInputControl from './AxisInputControl';
import { InputControlOptions } from './InputControl';

export interface AxisCompositeOptions extends InputControlOptions<number> {
	negative: AxisInputControl;
	positive: AxisInputControl;
}

export default class AxisComposite extends AxisInputControl {
	constructor(options: AxisCompositeOptions) {
		const {
			negative,
			positive,
			...opts
		} = options;
		const read = () => {
			const neg = this.children.get('negative').read();
			const pos = this.children.get('positive').read();
			return pos - neg;
		};
		super(read, opts);

		this.children.set('negative', negative);
		this.children.set('positive', positive);

		const onChange = () => this.emit('change');
		this.children.forEach(child => {
			child.on('change', onChange);
		});
	}
}
