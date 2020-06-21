export default function copyOptions(dest, src) {
	if (!src) {
		return;
	}
	Object.keys(dest).forEach(key => {
		if (key in src && typeof dest[key] !== 'function') {
			dest[key] = src[key];
		}
	});
}

