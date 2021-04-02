import runProcessors from '../util/runProcessors';
import copyOptions from '../util/copyOptions';

export default class InputControl {
	static defaultValue = 0;

	name = '';
	parent = null;
	children = new Map();
	device = null;
	enabled = true;
	processors = [];

	constructor(readRaw, options) {
		if (readRaw && typeof readRaw === 'object' && !options) {
			options = readRaw;
			readRaw = null;
		}

		const {
			processors,
			children,
			active,
			...opts
		} = options || {};

		copyOptions(this, opts);

		if (processors) {
			for (const p of processors) {
				this.processors.push(p);
			}
		}

		if (children) {
			const iterable = children[Symbol.iterator] ? children : Object.entries(children);
			for (const [key, value] of iterable) {
				this.children.set(key, value);
			}
		}

		const readUnprocessed = readRaw || this.read.bind(this);
		const read = () => runProcessors(this.processors, readUnprocessed());

		this.read = () => {
			return this.enabled ?
				read() :
				Object.getPrototypeOf(this).constructor.defaultValue;
		};

		if (typeof active === 'function') {
			this.active = () => active(this);
		}
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
				return child.find(path.substring(i + 1));
			}
		}

		return this.children.get(path) || null;
	}

	read() {
		return Object.getPrototypeOf(this).constructor.defaultValue;
	}

	magnitude(val = this.read()) {
		return Math.abs(val);
	}

	active() {
		return this.magnitude() > 0;
	}
}
