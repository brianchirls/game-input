import ButtonInputControl from '../../controls/ButtonInputControl';
import boolAsNum from '../../util/boolAsNum';

/*
todo:
need to handle different keyboard layouts
e.g. in France and Belgium, WASD => ZQSD
optionally use .code instead of .key?

https://www.w3.org/TR/uievents-code/#code-value-tables
*/

export default function Keyboard({
	enabled = true
} = {}) {
	const keysDown = new Set();

	const onKeyDown = evt => {
		keysDown.add(evt.key.toLowerCase());
	};
	const onKeyUp = evt => {
		keysDown.delete(evt.key.toLowerCase());
	};

	function readAnyKey() {
		return keysDown.size > 0;
	}

	function readSingleKey(key) {
		return keysDown.has(key.toLowerCase());
	}

	function readFilterKey(filter) {
		return readAnyKey() && filter(new Set(keysDown));
	}

	function readArrayKey(keys) {
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

	this.getControl = (name, options = {}) => {
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
