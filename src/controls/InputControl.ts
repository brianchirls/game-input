import runProcessors, { Processor } from '../util/runProcessors';
import copyOptions from '../util/copyOptions';

export abstract class InputControlBase<T = any> {
	static defaultValue: any = 0;

	name = '';
	parent: InputControlBase = null;
	enabled = true;
	children = new Map<string, InputControl>();
	device: any = null;
	processors = [] as Processor<T>[];

	abstract read(): T;
	abstract find(path?: string): InputControlBase | null;
	abstract magnitude(val?: T): number;
	abstract active(): boolean;
}

export interface InputControlOptions<T> {
	name?: string;
	parent?: InputControlBase;
	enabled?: boolean;
	device?: any;

	processors?: Processor<T>[];
	children?: Map<string, InputControl> | [string, InputControl][] | { [k: string]: InputControl };
	active?: (ic: InputControlBase<T>) => boolean;
}

export default class InputControl<T = any> extends InputControlBase<T> {

	constructor(readRaw?: (() => T) | InputControlOptions<T>, options?: InputControlOptions<T>) {
		super();

		if (readRaw && typeof readRaw === 'object' && !options) {
			options = readRaw;
			readRaw = undefined;
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
			const iterable = Array.isArray(children) || children instanceof Map ?
				children :
				Object.entries(children);
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

	find(path?: string): InputControlBase | null {
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
