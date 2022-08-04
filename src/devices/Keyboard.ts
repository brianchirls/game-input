import ButtonInputControl, { ButtonInputControlOptions } from '../controls/ButtonInputControl';
import boolAsNum from '../util/boolAsNum';
import { Device, DeviceEvents, DeviceOptions } from '../Device';
import { WildcardHandler } from 'mitt';

export interface KeyboardDeviceOptions extends DeviceOptions {
	/**
	 * Optionally use layout-independent Key Code instead of
	 * key value string. (default: `true`)
	 *
	 * Key Codes:
	 * https://www.w3.org/TR/uievents-code/#code-value-tables
	 *
	 * If false, use key values:
	 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
	 */
	keyCode?: boolean;
}

export interface KeyboardGetControlOptions extends Omit<ButtonInputControlOptions, 'device' | 'children'> {
	/**
	 * filter may be one of the following:
	 * - string: name of code (or key value)
	 * - array of strings: responds to any of the keys in the array
	 * - function: a callback that gets called with a Set of active key names and
	 * is expected to return a boolean, whether or not to respond to the keyboard event.
	 */
	filter?: string | string[] | ((keys: Set<string>) => boolean)
}

type KeyboardEvents = DeviceEvents & {
	enable: undefined;
	disable: undefined;
}

/**
 * A Keyboard device.
 */
export default class Keyboard extends Device<KeyboardEvents> {
	/**
	 * Create a {@link controls/ButtonInputControl.ButtonInputControl | button control} for a single key or combination of keys.
	 * Key names correspond to the [names used by DOM `KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values).
	 *
	 * @param name The name of the control. If no `filter` option is provided, this
	 * also specifies which key on the keyboard to use.
	 */
	declare getControl: (name: string, options?: KeyboardGetControlOptions) => ButtonInputControl;

	declare on: {
		/**
		 * Emitted when the Device is set to enabled
		 * @event
		 */
		(type: 'enable', handler: () => void): void;

		/**
		 * Emitted when the Device is set to disabled
		 * @event
		 */
		(type: 'disable', handler: () => void): void;

		/**
		 * Emitted when any value changes.
		 * @event
		 */
		(type: 'change', handler: () => void): void;

		(type: '*', handler: WildcardHandler<KeyboardEvents>): void;
	};

	/**
	 * Always true.
	 */
	declare readonly connected: boolean;

	/**
	 * @param keyboardOptions options
	 */
	constructor(keyboardOptions?: KeyboardDeviceOptions) {
		super();

		let destroyed = false;
		let enabled = false;
		const keyCode = keyboardOptions?.keyCode !== false;

		const keysDown = new Set<string>();

		const onKeyDown = (evt: KeyboardEvent) => {
			const key = keyCode ? evt.code : evt.key;
			keysDown.add(key);
			keysDown.add(key.toLowerCase());
			this.emit('change');
		};
		const onKeyUp = (evt: KeyboardEvent) => {
			const key = keyCode ? evt.code : evt.key;
			keysDown.delete(key);
			keysDown.delete(key.toLowerCase());
			this.emit('change');
		};

		function readAnyKey() {
			return keysDown.size > 0;
		}

		function readSingleKey(key: string) {
			return keysDown.has(key.toLowerCase());
		}

		function readFilterKey(filter: (keys: Set<string>) => boolean) {
			return readAnyKey() && filter(new Set<string>(keysDown));
		}

		function readArrayKey(keys: string[]) {
			return keys.some(readSingleKey);
		}

		const enable = (emitEvent = false) => {
			if (!enabled) {
				enabled = true;
				window.addEventListener('keydown', onKeyDown);
				window.addEventListener('keyup', onKeyUp);
				if (emitEvent) {
					this.emit('enable');
				}
			}
		};

		const disable = (emitEvent = false) => {
			if (enabled) {
				enabled = false;
				keysDown.clear();
				window.removeEventListener('keydown', onKeyDown);
				window.removeEventListener('keyup', onKeyUp);
				if (emitEvent) {
					this.emit('disable');
				}
			}
		};

		this.getControl = (name: string, options = {}) => {
			const {
				filter = name,
				...opts
			} = options;

			let read = readAnyKey;
			if (filter) {
				if (typeof filter === 'string') {
					read = () => readSingleKey(filter);
				} else if (typeof filter === 'function') {
					read = () => readFilterKey(filter);
				} else if (Array.isArray(filter)) {
					read = () => readArrayKey(filter);
				}
			}

			return new ButtonInputControl(boolAsNum(read), Object.assign({
				name: options.filter ?
					String(name || filter) :
					typeof filter === 'string' && filter ?
						`key:${filter}` :
						String(name || filter || 'any key')
			}, opts, {
				device: this,
				children: null
			}));
		};

		const destroyEventEmitter = this.destroy;
		this.destroy = () => {
			destroyed = true;
			destroyEventEmitter();
			disable();
		};

		// assume keyboard is always connected
		Object.defineProperties(this, {
			connected: {
				enumerable: false,
				configurable: false,
				writable: false,
				value: true
			},
			enabled: {
				get: () => enabled,
				set(val) {
					if (val && !destroyed) {
						enable(true);
					} else {
						disable(true);
					}
				}
			}
		});

		if (keyboardOptions?.enabled !== false) {
			enable();
		}
	}
}
