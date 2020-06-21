import ButtonInputControl from '../../controls/ButtonInputControl';

export default function Keyboard() {
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

	const boolAsNum = fn => () => fn() ? 1 : 0;

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
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	};

	// assume keyboard is always connected
	Object.defineProperty(this, 'connected', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: true
	});

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);
}
