import ButtonInputControl from '../../controls/ButtonInputControl';
import boolAsNum from '../../util/boolAsNum';

/*
todo:
need to handle different keyboard layouts
e.g. in France and Belgium, WASD => ZQSD
optionally use .code instead of .key?

https://www.w3.org/TR/uievents-code/#code-value-tables
*/

interface GetControlOptions {
	filter?: string | string[] | ((keys: Set<string>) => boolean)
}

export default class Keyboard {
	getControl: (name: string, options?: GetControlOptions) => ButtonInputControl;
	destroy: () => void;
	constructor({
		enabled = true
	} = {}) {
		const keysDown = new Set<string>();

		const onKeyDown = (evt: KeyboardEvent) => {
			keysDown.add(evt.key.toLowerCase());
		};
		const onKeyUp = (evt: KeyboardEvent) => {
			keysDown.delete(evt.key.toLowerCase());
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
			}, opts));
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
