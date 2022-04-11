import Action from './Action';
import InputControl, { InputControlBase } from './controls/InputControl';
import Vector2InputControl from './controls/Vector2InputControl';

describe('Action', () => {
	describe('constructor', () => {
		it('should be a function', () => {
			expect(typeof Action).toBe('function');
		});

		it('should have default property values with no options', () => {
			const action = new Action();

			expect(action.name).toBe('');
			expect(action.enabled).toBe(true);
			expect(action.bindings).toEqual([]);
			expect(action.processors).toEqual([]);
			expect(action.activeControl).toBeNull();
			expect(action.value).toBeUndefined();
		});

		it('should set options from first argument', () => {
			const options = {
				name: 'some name',
				enabled: false
			};
			const action = new Action(options);
			expect(action).toMatchObject(options);
		});

		it('should set bindings from array', () => {
			const bindings = [
				{
					control: new InputControl(),
					processors: []
				}
			];
			const action = new Action(bindings);
			expect(action.bindings).toStrictEqual(bindings);
		});

		it('should set bindings from array in options', () => {
			const bindings = [
				{
					control: new InputControl(),
					processors: []
				}
			];
			const action = new Action({
				bindings
			});
			expect(action.bindings).toStrictEqual(bindings);
		});

		it('should set processors from array', () => {
			const processors = [
				() => 1,
				() => 2
			];
			const action = new Action({
				processors
			});
			expect(action.processors).toStrictEqual(processors);
		});

		it('should set default value from first binding', () => {
			const bindings = [
				{
					control: new Vector2InputControl(() => [1, 1]),
					processors: []
				}
			];
			const action = new Action(bindings);
			expect(action.value).toEqual([0, 0]);
		});
	});

	describe('bind', () => {
		it('should accept only control argument', () => {
			const action = new Action();
			const control = new InputControl();
			action.bind(control);
			expect(action.bindings).toEqual([
				{
					control,
					processors: undefined
				}
			]);
		});

		it('should accept only options argument', () => {
			const action = new Action();
			const control = new InputControl();
			const processors = [(val: number) => val * 2];
			action.bind({
				control,
				processors
			});
			expect(action.bindings).toEqual([
				{
					control,
					processors
				}
			]);
		});

		it('should accept both control and options arguments', () => {
			const action = new Action();
			const control = new InputControl();
			const processors = [(val: number) => val * 2];
			action.bind(control, {
				processors
			});
			expect(action.bindings).toEqual([
				{
					control,
					processors
				}
			]);
		});

		it('should return index of new binding', () => {
			const action = new Action([
				new InputControl()
			]);
			const control = new InputControl();
			const processors = [(val: number) => val * 2];
			const index = action.bind(control, {
				processors
			});
			expect(index).toBe(1);
		});

		it('should throw an error if control is wrong type', () => {
			const action = new Action();
			expect(() => {
				action.bind({
					control: <InputControlBase><unknown>{
						foo: 'bar'
					}
				});
			}).toThrow();
		});
	});

	describe('unbind', () => {
		it('should remove binding from list', () => {
			const one = new InputControl();
			const two = new InputControl();
			const three = new InputControl();
			const action = new Action([
				one,
				two,
				three
			]);
			action.unbind(1);
			expect(action.bindings).toEqual([
				{
					control: one,
					processors: undefined
				},
				{
					control: three,
					processors: undefined
				}
			]);
		});

		// todo: test that state gets reset if removed activeBinding
	});

	describe('update and value', () => {
		it('should use the control with greatest magnitude', () => {
			const low = new InputControl(() => 1);
			const mid = new InputControl(() => 2);
			const high1 = new InputControl(() => 3);
			const high2 = new InputControl(() => 3);
			const action = new Action([
				mid,
				high1,
				low,
				high2
			]);
			action.update();
			expect(action.value).toBe(3);
			expect(action.activeControl).toBe(high1);
		});

		it('should run Action processors', () => {
			const p1 = (val: number) => val + 1;
			const p2 = (val: number) => -val;
			const read = () => 12345;
			const inputControl = new InputControl(read);
			const action = new Action({
				bindings: [inputControl],
				processors: [
					p1,
					p2
				]
			});
			action.update();
			expect(action.value).toBe(-12346);
		});

		it('should run binding processors', () => {
			const p1 = (val: number) => val + 1;
			const p2 = (val: number) => -val;
			const read = () => 12345;
			const inputControl = new InputControl(read, {
				processors: [
					p1,
					p2
				]
			});
			const action = new Action([inputControl]);
			action.update();
			expect(action.value).toBe(-12346);
		});

		it('should emit \'update\' event once per update', () => {
			const onChange = jest.fn();

			const action = new Action([
				new InputControl(() => 1)
			]);

			action.on('update', onChange);
			action.update();
			action.update();
			action.update();
			expect(action.value).toBe(1);
			expect(onChange).toHaveBeenCalledTimes(3);
		});

		it('should emit \'change\' event only when changed', () => {
			const onChange = jest.fn();

			let value = 1;
			const action = new Action([
				new InputControl(() => value)
			]);
			action.update();

			action.on('change', onChange);
			action.update();
			expect(action.value).toBe(1);
			expect(onChange).not.toHaveBeenCalled();

			value++;
			action.update();
			action.update();
			expect(action.value).toBe(2);
			expect(onChange).toHaveBeenCalledTimes(1);
		});
	});

	describe('.enabled', () => {
		it('should not change value if not enabled', () => {
			const read = jest.fn(() => 50);
			const action = new Action({
				bindings: [new InputControl(read)],
				enabled: false
			});
			action.update();
			expect(action.value).toBe(0);
			expect(read).not.toHaveBeenCalled();
		});

		it('should emit \'enable\' event when set to true', () => {
			const action = new Action({
				enabled: false
			});

			const onEnable = jest.fn();
			action.on('enable', onEnable);

			const onDisable = jest.fn();
			action.on('disable', onDisable);

			action.enabled = false; // redundant, do nothing
			expect(onEnable).not.toHaveBeenCalled();
			expect(onDisable).not.toHaveBeenCalled();

			action.enabled = true;
			expect(onEnable).toHaveBeenCalled();
			expect(onDisable).not.toHaveBeenCalled();
		});

		it('should emit \'disable\' event when set to false', () => {
			const action = new Action({
				enabled: true
			});

			const onEnable = jest.fn();
			action.on('enable', onEnable);

			const onDisable = jest.fn();
			action.on('disable', onDisable);

			action.enabled = true; // redundant, do nothing
			expect(onEnable).not.toHaveBeenCalled();
			expect(onDisable).not.toHaveBeenCalled();

			action.enabled = false;
			expect(onEnable).not.toHaveBeenCalled();
			expect(onDisable).toHaveBeenCalled();
		});
	});

	describe('destroy', () => {
		it('should set enabled to false', () => {
			const action = new Action();
			expect(action.enabled).toBe(true);
			action.destroy();
			expect(action.enabled).toBe(false);
		});

		it('should not allow setting enabled to true', () => {
			const action = new Action();
			action.destroy();
			action.enabled = true;
			expect(action.enabled).toBe(false);
		});

		it('should remove event listeners', () => {
			const action = new Action();
			const mock = jest.fn();
			action.on('change', mock);
			action.destroy();
			action.emit('change');
			expect(mock).not.toHaveBeenCalled();
		});
	});
});
