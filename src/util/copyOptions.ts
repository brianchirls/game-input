export default function copyOptions(dest: { [x: string]: any; }, src: { [x: string]: any; }) {
	if (!src) {
		return;
	}
	Object.keys(dest).forEach(key => {
		if (key in src && typeof dest[key] !== 'function') {
			dest[key] = src[key];
		}
	});
}

