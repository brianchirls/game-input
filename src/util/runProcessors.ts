const reduce = <T, >(prev: T, fn: (x: T) => T) =>
	fn(prev);

export type Processor<T> = (x: T) => T;

export default function runProcessors<T>(processors: Processor<T>[], initialValue: T) {
	return processors.reduce(reduce, initialValue);
}
