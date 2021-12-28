import ButtonInputControl from './ButtonInputControl';
import StickInputControl from './StickInputControl';

const buttonNames = ['left', 'right', 'up', 'down'];

function getButtons(control: StickInputControl) {
	const obj = {} as { [x: string]: ButtonInputControl };
	return buttonNames.reduce((obj, key) => ({
		...obj,
		[key]: <ButtonInputControl>control.find(key)
	}), obj);
}

describe('StickInputControl', () => {
	it('should have no buttons pressed if x and y are 0', () => {
		const read = () => [0, 0] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(false);
		expect(buttons.right.pressed()).toBe(false);
		expect(buttons.up.pressed()).toBe(false);
		expect(buttons.down.pressed()).toBe(false);
	});

	it('should have right button pressed if x > 0', () => {
		const read = () => [1, 0] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(false);
		expect(buttons.right.pressed()).toBe(true);
		expect(buttons.up.pressed()).toBe(false);
		expect(buttons.down.pressed()).toBe(false);
	});

	it('should have left button pressed if x < 0', () => {
		const read = () => [-1, 0] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(true);
		expect(buttons.right.pressed()).toBe(false);
		expect(buttons.up.pressed()).toBe(false);
		expect(buttons.down.pressed()).toBe(false);
	});

	it('should have up button pressed if y > 0', () => {
		const read = () => [0, 1] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(false);
		expect(buttons.right.pressed()).toBe(false);
		expect(buttons.up.pressed()).toBe(true);
		expect(buttons.down.pressed()).toBe(false);
	});

	it('should have down button pressed if y < 0', () => {
		const read = () => [0, -1] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(false);
		expect(buttons.right.pressed()).toBe(false);
		expect(buttons.up.pressed()).toBe(false);
		expect(buttons.down.pressed()).toBe(true);
	});

	it('should have up and right button pressed if x and y > 0', () => {
		const read = () => [1, 1] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(false);
		expect(buttons.right.pressed()).toBe(true);
		expect(buttons.up.pressed()).toBe(true);
		expect(buttons.down.pressed()).toBe(false);
	});

	it('should have down and right button pressed if x > 0 and y < 0', () => {
		const read = () => [1, -1] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(false);
		expect(buttons.right.pressed()).toBe(true);
		expect(buttons.up.pressed()).toBe(false);
		expect(buttons.down.pressed()).toBe(true);
	});

	it('should have down and left button pressed if x < 0 and y < 0', () => {
		const read = () => [-1, -1] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(true);
		expect(buttons.right.pressed()).toBe(false);
		expect(buttons.up.pressed()).toBe(false);
		expect(buttons.down.pressed()).toBe(true);
	});

	it('should have up and left button pressed if x < 0 and y > 0', () => {
		const read = () => [-1, 1] as [number, number];
		const vector2InputControl = new StickInputControl(read);
		const buttons = getButtons(vector2InputControl);

		expect(buttons.left.pressed()).toBe(true);
		expect(buttons.right.pressed()).toBe(false);
		expect(buttons.up.pressed()).toBe(true);
		expect(buttons.down.pressed()).toBe(false);
	});
});
