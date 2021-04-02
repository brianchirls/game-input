import StickInputControl from './StickInputControl';

const buttonNames = ['left', 'right', 'up', 'down'];

function getButtons(control) {
	return buttonNames.reduce((obj, key) => ({
		...obj,
		[key]: control.find(key)
	}), {});
}

describe('StickInputControl', () => {
	it('should have no buttons pressed if x and y are 0', () => {
		const read = () => [0, 0];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(false);
		expect(buttons.right.pressed()).toEqual(false);
		expect(buttons.up.pressed()).toEqual(false);
		expect(buttons.down.pressed()).toEqual(false);
	});

	it('should have right button pressed if x > 0', () => {
		const read = () => [1, 0];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(false);
		expect(buttons.right.pressed()).toEqual(true);
		expect(buttons.up.pressed()).toEqual(false);
		expect(buttons.down.pressed()).toEqual(false);
	});

	it('should have left button pressed if x < 0', () => {
		const read = () => [-1, 0];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(true);
		expect(buttons.right.pressed()).toEqual(false);
		expect(buttons.up.pressed()).toEqual(false);
		expect(buttons.down.pressed()).toEqual(false);
	});

	it('should have up button pressed if y > 0', () => {
		const read = () => [0, 1];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(false);
		expect(buttons.right.pressed()).toEqual(false);
		expect(buttons.up.pressed()).toEqual(true);
		expect(buttons.down.pressed()).toEqual(false);
	});

	it('should have down button pressed if y < 0', () => {
		const read = () => [0, -1];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(false);
		expect(buttons.right.pressed()).toEqual(false);
		expect(buttons.up.pressed()).toEqual(false);
		expect(buttons.down.pressed()).toEqual(true);
	});

	it('should have up and right button pressed if x and y > 0', () => {
		const read = () => [1, 1];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(false);
		expect(buttons.right.pressed()).toEqual(true);
		expect(buttons.up.pressed()).toEqual(true);
		expect(buttons.down.pressed()).toEqual(false);
	});

	it('should have down and right button pressed if x > 0 and y < 0', () => {
		const read = () => [1, -1];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(false);
		expect(buttons.right.pressed()).toEqual(true);
		expect(buttons.up.pressed()).toEqual(false);
		expect(buttons.down.pressed()).toEqual(true);
	});

	it('should have down and left button pressed if x < 0 and y < 0', () => {
		const read = () => [-1, -1];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(true);
		expect(buttons.right.pressed()).toEqual(false);
		expect(buttons.up.pressed()).toEqual(false);
		expect(buttons.down.pressed()).toEqual(true);
	});

	it('should have up and left button pressed if x < 0 and y > 0', () => {
		const read = () => [-1, 1];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toEqual(true);
		expect(buttons.right.pressed()).toEqual(false);
		expect(buttons.up.pressed()).toEqual(true);
		expect(buttons.down.pressed()).toEqual(false);
	});
});
