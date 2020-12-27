import mitt from 'mitt';

export default function eventEmitter(obj) {
	const {
		all,
		on,
		off,
		emit
	} = mitt();

	Object.assign(obj, {
		on,
		off,
		emit
	});

	return () => all.clear();
}
