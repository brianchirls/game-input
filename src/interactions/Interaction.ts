import Action from '../Action';
import EventEmitter from '../util/EventEmitter';

// dest: source
const stateTransitions = {
	disabled: {
		started: ['cancel', 'disable'],
		// complete: ['reset'],
		'*': ['disable']
	},
	ready: {
		started: ['cancel', 'ready'],
		'*': ['ready']
	},
	started: {
		disabled: ['enable', 'start'],
		'*': ['start']
	},
	complete: {
		disabled: ['enable', 'start', 'complete'],
		started: ['complete'],
		'*': ['start', 'complete']
	}
};

type InteractionState = 'disabled' | 'ready' | 'started' | 'complete';

interface InteractionEvents {
	cancel: unknown;
	disable: unknown;
	[x: string]: unknown;
}

export default class Interaction<ActionType=any> extends EventEmitter<InteractionEvents> {
	readonly enabled: boolean;
	readonly action: Action<ActionType>;
	readonly state: InteractionState;
	update: () => void;

	// some interactions may use a specific action type, depending on whether they
	// use magnitude or value
	constructor(action: Action<ActionType>) {

		if (!action) {
			throw new Error('Interaction requires an Action');
		}

		super();

		let destroyed = false;
		let enabled = true;
		let state = 'ready';
		let value = 0;

		const transition = (newState: InteractionState) => {
			if (state === newState) {
				return;
			}

			const destState = stateTransitions[newState];
			const events = destState[state] || destState['*'];
			state = newState;
			events.forEach((evt: string) => this.emit(evt));
		};

		const onChange = () => {
			value = enabled ? this.evaluate() : 0;
			if (value <= 0) {
				transition('ready');
			} else if (value >= 1) {
				transition('complete');
			} else {
				transition('started');
			}
		};

		action.on('change', onChange);
		action.on('enable', onChange);
		action.on('disable', onChange);

		this.update = onChange;

		const destroyEventEmitter = this.destroy;
		this.destroy = () => {
			destroyed = true;
			enabled = false;
			destroyEventEmitter();
		};
		this.destroy = () => {
			action.off('change', onChange);
			action.off('enable', onChange);
			action.off('disable', onChange);
			destroyEventEmitter();
		};

		Object.defineProperties(this, {
			enabled: {
				set(val) {
					val = !!val;
					if (val !== enabled && !destroyed) {
						enabled = val;
						if (enabled) {
							// todo: should we evaluate now?
							transition('ready');
						} else {
							transition('disabled');
						}
					}
				},
				get: () => enabled
			},
			action: {
				get: () => action
			},
			state: {
				get: () => state
			}
		});
	}

	evaluate(): number {
		return (this.action.activeControl?.magnitude() || 0) > 0 ? 1 : 0;
	}
}
