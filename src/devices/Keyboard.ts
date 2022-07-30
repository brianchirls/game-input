import ButtonInputControl, { ButtonInputControlOptions } from '../controls/ButtonInputControl';
import boolAsNum from '../util/boolAsNum';
import { Device, DeviceOptions } from '../Device';

/*
todo:
Emit 'change' event only to controls relevant to changed key.
Currently, we emit to every control, which is ineffecient.
*/

export interface KeyboardDeviceOptions extends DeviceOptions {
	/**
	 * Optionally use layout-independent Key Code instead of
	 * key value string. (default: `false`)
	 *
	 * Key Codes:
	 * https://www.w3.org/TR/uievents-code/#code-value-tables
	 */
	keyCode: boolean;
}

export interface KeyboardGetControlOptions extends Omit<ButtonInputControlOptions, 'device' | 'children'> {
	/**
	 * filter may be one of the following:
	 * - string: [name of key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) on the keyboard to respond to
	 * - array of strings: responds to any of the keys in the array
	 * - function: a callback that gets called with a Set of active key names and
	 * is expected to return a boolean, whether or not to respond to the keyboard event.
	 */
	filter?: string | string[] | ((keys: Set<string>) => boolean)
}

/**
 * A Keyboard device.
 */
export default class Keyboard extends Device {
	/**
	 * Create a {@link controls/ButtonInputControl.ButtonInputControl | button control} for a single key or combination of keys.
	 * Key names correspond to the [names used by DOM `KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values).
	 *
	 * @param name The name of the control. If no `filter` option is provided, this
	 * also specifies which key on the keyboard to use.
	 */
	declare getControl: (name: string, options?: KeyboardGetControlOptions) => ButtonInputControl;

	/**
	 * Always true.
	 */
	declare readonly connected: boolean;

	/**
	 * @param options options
	 */
	constructor({
		enabled = true,
		keyCode = false
	} = {} as KeyboardDeviceOptions) {
		super();

		const keysDown = new Set<string>();

		const onKeyDown = (evt: KeyboardEvent) => {
			const key = (keyCode ? evt.code : evt.key).toLowerCase();
			keysDown.add(key);
			if (enabled) {
				this.emit('change');
			}
		};
		const onKeyUp = (evt: KeyboardEvent) => {
			const key = (keyCode ? evt.code : evt.key).toLowerCase();
			keysDown.delete(key);
			if (enabled) {
				this.emit('change');
			}
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

		function enable() {
			enabled = true;
			window.addEventListener('keydown', onKeyDown);
			window.addEventListener('keyup', onKeyUp);
		}

		function disable() {
			enabled = false;
			keysDown.clear();
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
		}

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
				name: typeof name === 'string' && options.filter ?
					name :
					typeof filter === 'string' ?
						`key:${filter}` :
						String(name || filter)
			}, opts, {
				device: this,
				children: null
			}));
		};

		this.destroy = () => {
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
					if (!!val !== !!enabled) {
						if (val) {
							enable();
						} else {
							disable();
						}
					}
				}
			}
		});

		if (enabled) {
			enable();
		}
	}
}
