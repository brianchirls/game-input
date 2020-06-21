const reduce = (prev, fn) => fn(prev);

export default function runProcessors(processors, initialValue) {
	return processors.reduce(reduce, initialValue);
}
