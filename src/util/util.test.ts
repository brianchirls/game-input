import boolAsNum from './boolAsNum';
import copyOptions from './copyOptions';
import runProcessors from './runProcessors';

describe('util', () => {
	describe('boolAsNum', () => {
		it('should convert true to 1', () => {
			const one = boolAsNum(() => true);
			expect(one()).toBe(1);
		});

		it('should convert false to 0', () => {
			const zero = boolAsNum(() => false);
			expect(zero()).toBe(0);
		});

		it('should convert truthy string to 1', () => {
			const one = boolAsNum(() => 'something');
			expect(one()).toBe(1);
		});

		it('should convert empty string to 0', () => {
			const zero = boolAsNum(() => '');
			expect(zero()).toBe(0);
		});

		it('should convert non-zero number to 1', () => {
			const one = boolAsNum(() => -0.001);
			expect(one()).toBe(1);
		});

		it('should convert zero to 0', () => {
			const zero = boolAsNum(() => 0);
			expect(zero()).toBe(0);
		});
	});

	describe('copyOptions', () => {
		it('should copy all properties from src', () => {
			const src = {
				foo: 'bar',
				baz: {
					qux: 'quux'
				}
			};

			const dest = {
				foo: '',
				baz: null
			};

			copyOptions(dest, src);

			Object.keys(src).forEach(key => {
				expect(dest[key]).toStrictEqual(src[key]);
			});
		});

		it('should not modify object if src is nothing', () => {
			const dest = {
				foo: '',
				baz: ''
			};

			const destCopy = Object.assign({}, dest);
			copyOptions(dest, null);

			expect(dest).toStrictEqual(destCopy);
		});

		it('should not modify src', () => {
			const src = {
				foo: 'bar',
				baz: 'biddle'
			};

			const srcCopy = Object.assign({}, src);

			const dest = {
				foo: '',
				baz: null
			};

			copyOptions(dest, src);
			expect(src).toStrictEqual(srcCopy);
		});

		it('should should not copy unknown properties from src', () => {
			const src = {
				foo: 'bar',
				baz: 'biddle'
			};

			const dest = {
				foo: ''
			};

			copyOptions(dest, src);

			expect(dest.foo).toEqual(src.foo);
			expect(<any>dest.baz).toBeUndefined();
		});

		it('should not overwrite functions/methods', () => {
			const src = {
				foo: 'bar',
				baz: 'biddle'
			};

			const dest = {
				foo: '',
				baz: '',
				method: () => true
			};

			const method = dest.method;

			copyOptions(dest, src);

			expect(dest.method).toStrictEqual(method);
			Object.keys(src).forEach(key => {
				expect(dest[key]).toStrictEqual(src[key]);
			});
		});
	});

	describe('runProcessors', () => {
		it('should reduce all function results in order', () => {
			const processors = 'BCDEFG'
				.split('')
				.map(letter => prev => prev + letter);

			const reduced = runProcessors(processors, 'A');
			expect(reduced).toBe('ABCDEFG');
		});

		it('should call processors with only input argument', () => {
			runProcessors([
				(prev, ...args) => {
					expect(prev).toBe('A');
					expect(args).toEqual([]);
					return 'B';
				},
				(prev, ...args) => {
					expect(prev).toBe('B');
					expect(args).toEqual([]);
					return 'C';
				}
			], 'A');
		});
	});
});
