const buttonIndexes = {
	dpadUp: 12,
	dpadDown: 13,
	dpadLeft: 14,
	dpadRight: 15,
	L1: 4,
	L2: 6,
	L3: 10,
	R1: 5,
	R2: 7,
	R3: 11,
	A: 0,
	B: 1,
	X: 2,
	Y: 3,
	start: 9,
	select: 8,
	home: 16
};
const buttons = [];
Object.keys(buttonIndexes).forEach(key => {
	buttons[buttonIndexes[key]] = key;
});

const axes = [
	'leftStickX',
	'leftStickY',
	'rightStickX',
	'rightStickY'
];

const sticks = [
	'leftStick',
	'rightStick'
];

export {
	buttons,
	buttonIndexes,
	axes,
	sticks
};
