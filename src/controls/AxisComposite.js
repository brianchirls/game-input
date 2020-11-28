import AxisInputControl from './AxisInputControl';

export default class AxisComposite extends AxisInputControl {
	constructor({
		negative,
		positive,
		...opts
	}) {
		const read = () => {
			const neg = negative.read();
			const pos = positive.read();
			return (pos - neg) / 2;
		};
		super(read, opts);

		this.children.set('negative', negative);
		this.children.set('positive', positive);
	}
}
