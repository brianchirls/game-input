import AxisInputControl from './AxisInputControl';

export default class AxisComposite extends AxisInputControl {
	constructor({
		negative,
		positive,
		...opts
	}) {
		const read = () => {
			const neg = this.children.get('negative').read();
			const pos = this.children.get('positive').read();
			return pos - neg;
		};
		super(read, opts);

		this.children.set('negative', negative);
		this.children.set('positive', positive);
	}
}
