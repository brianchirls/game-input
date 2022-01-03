import runProcessors from './util/runProcessors';
import { InputControlBase } from './controls/InputControl';
import EventEmitter from './util/EventEmitter';

/*
todo: use something like hrtime or performance.now in node.js
*/
const now = typeof performance === undefined ?
	() => performance.now() : // eslint-disable-line no-undef
	() => Date.now();

interface ActionEvents<T> {
	[x: string]: { action: Action<T>, [k: string]: any };
}

interface ActionOptions {
	bindings?: any;
	processors?: any;
	name?: string;
	enabled?: boolean;
}

/*
todo: give everything ids so we can reference them later.
probably.
*/
export default class Action<ValueType> extends EventEmitter<ActionEvents<ValueType>> {
	name: string;
	enabled: boolean;
	bindings: any[];
	processors: any[];
	readonly value: ValueType;
	readonly activeControl: InputControlBase<ValueType>;
	bind: (control: any, options: any) => number;
	unbind: (index: number) => void;
	update: () => void;

	constructor(options: ActionOptions = {} as ActionOptions) {
		super();

		this.name = options.name || '';

		const bindings = [];
		const processors = [];

		let destroyed = false;
		let enabled = true;
		let activeBinding = null;
		let activeTime = 0;
		let value: ValueType;

		this.bindings = bindings;
		this.processors = processors;

		/*
		todo: we need better CRUD methods for bindings and processors
		*/
		this.bind = (control, options) => {
			if (!options && !(control instanceof InputControlBase)) {
				options = control;
			}
			if (options && options.control) {
				control = options.control;
			}

			if (!(control instanceof InputControlBase)) {
				// could we do this by duck-typing?
				throw new Error('Binding requires an InputControl');
			}

			const binding = {
				control,
				processors: options && options.processors
			};
			bindings.push(binding);
			return bindings.length - 1;
		};

		this.unbind = (index: number) => {
			if (index < bindings.length && index >= 0) {
				const binding = bindings.splice(index, 1);
				if (binding === activeBinding) {
					// todo: reset state
				}

				// todo: clear binding from queue
			}
		};

		this.update = () => {
			if (!enabled) {
				return;
			}

			const previousValue = value;
			const previousBinding = activeBinding;
			activeBinding = null;

			let best = -Infinity;
			for (let i = 0; i < bindings.length; i++) {
				const binding = bindings[i];
				const { control } = binding;
				if (control.enabled) {
					const controlValue = binding.processors ?
						runProcessors(binding.processors, control.read()) :
						control.read();
					const magnitude = control.magnitude(controlValue);
					if (magnitude > best) {
						value = controlValue;
						best = magnitude;
						if (magnitude > 0) {
							activeBinding = binding;
							if (!activeTime) {
								activeTime = now();
							}
						}
					}
				}
			}

			if (!activeBinding) {
				activeTime = 0;
			}

			// should processor happen before disambiguation?
			if (value !== undefined) {
				value = runProcessors(processors, value);
			}

			this.emit('update');
			if (value !== previousValue) {
				this.emit('change');
			}
		};

		const destroyEventEmitter = this.destroy;
		this.destroy = () => {
			destroyed = true;
			enabled = false;
			destroyEventEmitter();
		};

		Object.defineProperties(this, {
			enabled: {
				set(val) {
					val = !!val;
					if (val !== enabled && !destroyed) {
						enabled = val;
						if (enabled) {
							this.emit('enable');
						} else {
							this.emit('disable');
						}
					}
				},
				get: () => enabled
			},
			activeControl: {
				get: () => activeBinding ? activeBinding.control : null
			},
			value: {
				get: () => value
			}
		});

		if (options.bindings) {
			options.bindings.forEach(binding => {
				this.bind(binding);
			});
		}

		if (options.processors) {
			processors.push.apply(processors, options.processors);
		}

		if (!options.enabled === false) {
			this.enabled = false;
		}
	}
}
