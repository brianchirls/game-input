import eev from 'eev';
import runProcessors from './util/runProcessors';
import InputControl from './controls/InputControl';
import Interaction from './interactions/Interaction';

/*
todo: give everything ids so we can reference them later.
probably.
*/
const defaultInteraction = new Interaction();

export default function Action(options = {}) {
	eev.call(this);
	const me = this;

	this.name = options.name || '';

	const bindings = [];
	const processors = [];
	const interactions = [];
	const interactionStack = [];

	let destroyed = false;
	let enabled = true;
	let activeBinding = null;
	let activeTime = 0;
	let state = 'inactive';
	let value;

	this.bindings = bindings;
	this.processors = processors;
	this.interactions = interactions;

	/*
	states
	- inactive
	  - => active: started
	  - => complete: started, completed
	- active
	  - => complete: completed
	  - => inactive: canceled, ended
	- complete
	  - => inactive: ended
	*/
	const transitionState = (nextState, binding) => {
		if (nextState === state || !enabled) { // todo: and binding hasn't changed
			return;
		}

		if (nextState === 'active' && state === 'complete') {
			// stay right where we are
			return;
		}

		const events = [];

		if (nextState === 'complete') {
			transitionState('active', binding);
			events.push('completed');
		} else if (nextState === 'inactive') {
			if (state !== 'complete') {
				events.push('canceled');
			}
			events.push('ended');
		} else if (nextState === 'active') {
			events.push('started');
		} else {
			throw new Error('Unsupported state: ' + nextState);
		}

		state = nextState;
		events.forEach(event => this.emit(event, binding));
	};

	function clearInteractions() {
		interactionStack.forEach(({ interaction }) => interaction.reset());
		interactionStack.length = 0;
	}

	function processInteraction(binding, interaction) {
		let stackIndex = interactionStack.findIndex(
			iState => iState.binding === binding && iState.interaction === interaction
		);
		let iState = stackIndex >= 0 && interactionStack[stackIndex];

		const newState = interaction.process(binding, me) ||
			iState && iState.state ||
			'inactive';

		if (stackIndex < 0 && newState !== 'inactive') {
			stackIndex = interactionStack.length;
			iState = {
				binding,
				interaction,
				state: 'inactive'
			};
			interactionStack.push(iState);
		}
		if (iState) {
			iState.state = newState;
		}
	}

	/*
	todo: we need better CRUD methods for bindings, processors and interactions
	*/
	this.bind = (control, options) => {
		if (!options && !(control instanceof InputControl)) {
			options = control;
		}
		if (options && options.control) {
			control = options.control;
		}

		if (!(control instanceof InputControl)) {
			// could we do this by duck-typing?
			throw new Error('Binding requires an InputControl');
		}

		const binding = {
			control,
			processors: options && options.processors,
			interactions: options && options.interactions
		};
		bindings.push(binding);
		return bindings.length - 1;
	};

	this.unbind = index => {
		if (index < bindings.length) {
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

		const previousBinding = activeBinding;
		activeBinding = null;

		let best = -Infinity;
		for (let i = 0; i < bindings.length; i++) {
			const binding = bindings[i];
			const { control } = binding;
			const controlValue = control.read();
			const magnitude = control.magnitude(controlValue);
			if (magnitude > best) {
				value = controlValue;
				best = magnitude;
				if (magnitude > 0) {
					activeBinding = binding;
					if (!activeTime) {
						activeTime = performance.now();
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

		// interactions, events
		const interactionBinding = activeBinding || previousBinding;
		let interacted = interactions.length > 0;
		if (interactionBinding && interactionBinding.interactions) {
			interacted = interacted || interactionBinding.interactions.length > 0;
			interactionBinding.interactions.forEach(
				interaction => processInteraction(interactionBinding, interaction)
			);
		}

		// todo: this will not catch deactivated controls that need to be processed
		// we need to re-think this whole flow
		if (interactionBinding) {
			interactions.forEach(
				interaction => processInteraction(interactionBinding, interaction)
			);
		}

		if (interactionBinding && !interacted) {
			processInteraction(interactionBinding, defaultInteraction);
		}

		while (interactionStack.length) {
			const iState = interactionStack[0];
			if (iState.state === 'inactive') {
				interactionStack.shift();
				iState.interaction.reset();
				transitionState(iState.state, iState.binding);
			} else {
				if (iState.state === 'complete') {
					clearInteractions();
					transitionState('complete', iState.binding);
				}
				break;
			}
		}

		if (!interactionStack.length) {
			// resetInteractions();
			transitionState('inactive');
		}
	};

	this.destroy = () => {
		destroyed = true;
		enabled = false;
		clearInteractions();
		transitionState('inactive');
		state = 'destroyed';
	};

	Object.defineProperties(this, {
		enabled: {
			set(val) {
				val = !!val;
				if (val !== enabled && !destroyed) {
					enabled = val;
					transitionState('inactive');
					state = enabled ? 'inactive' : 'disabled';
					clearInteractions();
				}
			},
			get: () => enabled
		},
		activeControl: {
			get: () => activeBinding && activeBinding.control
		},
		state: {
			get: () => state
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

	if (options.interactions) {
		interactions.push.apply(interactions, options.interactions);
	}
}

Action.prototype = Object.create(eev.prototype);
