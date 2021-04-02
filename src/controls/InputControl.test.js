import InputControl from './InputControl';

describe('InputControl', () => {
	describe('constructor', () => {
		it('should be a function', () => {
			expect(typeof InputControl).toEqual('function');
		});

		it('should have a static default value', () => {
			expect(InputControl.defaultValue).toEqual(0);
		});

		it('should return default values with no options', () => {
			const inputControl = new InputControl();

			expect(inputControl.name).toEqual('');
			expect(inputControl.parent).toBeNull();
			expect(inputControl.device).toBeNull();
			expect(inputControl.enabled).toEqual(true);
			expect(inputControl.children).toEqual(new Map());
			expect(inputControl.processors).toEqual([]);
		});

		it('should set processors from array', () => {
			const processors = [
				() => 1,
				() => 2
			];
			const inputControl = new InputControl({
				processors
			});
			expect(inputControl.processors).toStrictEqual(processors);
		});

		it('should set children from map', () => {
			const children = new Map([
				['foo', new InputControl()],
				['bar', new InputControl()]
			]);
			const inputControl = new InputControl({
				children
			});

			children.forEach((ctrl, key) => {
				expect(inputControl.children.get(key)).toBe(ctrl);
			});

			expect(inputControl.children.size).toEqual(children.size);
		});

		it('should set children from object', () => {
			const children = {
				foo: new InputControl(),
				bar: new InputControl()
			};
			const inputControl = new InputControl({
				children
			});

			expect(inputControl.children.get('foo')).toBe(children.foo);
			expect(inputControl.children.get('bar')).toBe(children.bar);

			expect(inputControl.children.size).toEqual(2);
		});

		it('should set children from array', () => {
			const children = [
				['foo', new InputControl()],
				['bar', new InputControl()]
			];
			const inputControl = new InputControl({
				children
			});

			children.forEach(([key, ctrl]) => {
				expect(inputControl.children.get(key)).toBe(ctrl);
			});

			expect(inputControl.children.size).toEqual(children.length);
		});
	});

	describe('find', () => {
		it('should find self with no argument', () => {
			const inputControl = new InputControl();
			expect(inputControl.find()).toEqual(inputControl);
		});

		it('should return null if child does not exist', () => {
			const child = new InputControl();
			const parent = new InputControl({
				children: {
					child
				}
			});

			expect(parent.find('anything')).toBeNull();
		});

		it('should find first-level child', () => {
			const child = new InputControl();
			const parent = new InputControl({
				children: {
					child
				}
			});

			expect(parent.find('child')).toEqual(child);
		});

		it('should find second-level child', () => {
			const three = new InputControl();
			const two = new InputControl({
				children: {
					three
				}
			});
			const one = new InputControl({
				children: {
					two
				}
			});

			expect(one.find('two/three')).toEqual(three);
		});

		it('should return null if child does not exist (2nd level)', () => {
			const three = new InputControl();
			const two = new InputControl({
				children: {
					three
				}
			});
			const one = new InputControl({
				children: {
					two
				}
			});

			expect(one.find('missing/three')).toBeNull();
		});

	});

	describe('read', () => {
		it('should return default value with no read function', () => {
			const inputControl = new InputControl();
			expect(inputControl.read()).toEqual(0);
		});

		it('should return result of read function', () => {
			const read = jest.fn(() => 12345);
			const inputControl = new InputControl(read);
			expect(inputControl.read()).toEqual(12345);
			expect(read).toHaveBeenCalled();
		});

		it('should skip read function if not enabled', () => {
			const read = jest.fn(() => 12345);
			const inputControl = new InputControl(read);
			inputControl.enabled = false;

			expect(inputControl.read()).toEqual(0);
			expect(read).not.toHaveBeenCalled();
		});
	});

	describe('magnitude', () => {
		it('should return magnitude of read function result', () => {
			const read = jest.fn(() => -12345);
			const inputControl = new InputControl(read);
			expect(inputControl.magnitude()).toEqual(12345);
			expect(read).toHaveBeenCalled();
		});

		it('should return magnitude of argument', () => {
			const read = jest.fn(() => -12345);
			const inputControl = new InputControl(read);
			expect(inputControl.magnitude(-100)).toEqual(100);
			expect(read).not.toHaveBeenCalled();
		});
	});

	describe('active', () => {
		it('should return true if magnitude is greater than zero', () => {
			const read = jest.fn(() => -12345);
			const inputControl = new InputControl(read);
			expect(inputControl.active()).toEqual(true);
			expect(read).toHaveBeenCalled();
		});

		it('should return false if magnitude is zero', () => {
			const read = jest.fn(() => 0);
			const inputControl = new InputControl(read);
			expect(inputControl.active()).toEqual(false);
			expect(read).toHaveBeenCalled();
		});

		it('should return result of custom function', () => {
			let value = 1;

			const read = jest.fn(() => value);
			const active = jest.fn(ctrl => ctrl.read() >= 0.7);
			const inputControl = new InputControl(read, { active });

			// high value
			value = 1;
			expect(inputControl.active()).toEqual(true);

			// edge value
			value = 0.7;
			expect(inputControl.active()).toEqual(true);

			// low
			value = 0.6;
			expect(inputControl.active()).toEqual(false);

			expect(read).toHaveBeenCalledTimes(3);
			expect(active).toHaveBeenCalledTimes(3);
		});
	});
});
