import AxisInputControl from './AxisInputControl';
import Vector2InputControl from './Vector2InputControl';

describe('Vector2InputControl', () => {
	describe('constructor', () => {
		it('should be a function', () => {
			expect(typeof Vector2InputControl).toEqual('function');
		});

		it('should have a static default value', () => {
			expect(Vector2InputControl.defaultValue).toEqual([0, 0]);
		});
	});

	it('should have x and y children', () => {
		const vector2InputControl = new Vector2InputControl();

		const x = vector2InputControl.find('x');
		expect(x).toBeInstanceOf(AxisInputControl);

		const y = vector2InputControl.find('y');
		expect(y).toBeInstanceOf(AxisInputControl);
	});

	it('should have single value magnitude', () => {
		const read = () => [0.3, 0.4];
		const vector2InputControl = new Vector2InputControl(read);
		expect(vector2InputControl.magnitude()).toBeRoughly(0.5);
	});

	it('should be active if only x is > 0', () => {
		const read = () => [0.01, 0];
		const vector2InputControl = new Vector2InputControl(read);
		expect(vector2InputControl.active()).toEqual(true);
	});

	it('should be active if only y is > 0', () => {
		const read = () => [0, 0.01];
		const vector2InputControl = new Vector2InputControl(read);
		expect(vector2InputControl.active()).toEqual(true);
	});

	it('should be active if both x and y are > 0', () => {
		const read = () => [0.01, 0.01];
		const vector2InputControl = new Vector2InputControl(read);
		expect(vector2InputControl.active()).toEqual(true);
	});

	it('should be not active if both x and y are 0', () => {
		const read = () => [0, 0];
		const vector2InputControl = new Vector2InputControl(read);
		expect(vector2InputControl.active()).toEqual(false);
	});
});
