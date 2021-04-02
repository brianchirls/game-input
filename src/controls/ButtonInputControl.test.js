import ButtonInputControl from './ButtonInputControl';

describe('ButtonInputControl', () => {
	it('should be a function', () => {
		expect(typeof ButtonInputControl).toEqual('function');
	});

	it('should set options from first argument', () => {
		const options = {
			pressPoint: 0.6
		};

		const inputControl = new ButtonInputControl(options);
		expect(inputControl).toMatchObject(options);
	});

	it('should be pressed if value passes pressPoint', () => {
		const pressPoint = 0.6;
		const options = {
			pressPoint
		};

		const read = () => pressPoint;
		const inputControl = new ButtonInputControl(read, options);
		expect(inputControl.pressed()).toEqual(true);
	});

	it('should not be pressed if value is below pressPoint', () => {
		const pressPoint = 0.6;
		const options = {
			pressPoint
		};

		const read = () => 0.59;
		const inputControl = new ButtonInputControl(read, options);
		expect(inputControl.pressed()).toEqual(false);
	});

	it('should not be pressed if not enabled', () => {
		const pressPoint = 0.6;
		const options = {
			pressPoint
		};

		const read = () => 1;
		const inputControl = new ButtonInputControl(read, options);
		inputControl.enabled = false;
		expect(inputControl.pressed()).toEqual(false);
	});
});
