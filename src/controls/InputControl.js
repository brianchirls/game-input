import runProcessors from '../util/runProcessors';
import copyOptions from '../util/copyOptions';

export default class InputControl {
	static defaultValue = 0;

	name = '';
	parent = null;
	children = new Map();
	device = null;
	processors = [];

	constructor(read, options) {
		copyOptions(this, options);
		this.read = this.processors.length ?
			() => runProcessors(this.processors, read()) :
			read || this.read;
	}

	find(path) {
		if (!path) {
			return this;
		}

		const i = path.indexOf('/');
		if (i > 0) {
			const k = path.substring(0, i);
			const child = this.children.get(k);
			if (child) {
				return child.find(path.substring(k + 1));
			}
		}

		return this.children.get(path) || null;
	}

	read() {
		return this.prototype.defaultValue;
	}

	magnitude(val = this.read()) {
		return Math.abs(val);
	}
}
