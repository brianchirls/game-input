import stickDeadZone from './stickDeadZone';

describe('stickDeadZone', () => {
	it('inside dead zone should be zero', () =>
		expect(stickDeadZone([0, 0.05], 0.1, 0.9)).toEqual([0, 0])
	);

	it('high value', () =>
		expect(stickDeadZone([3, 4], 0.1, 0.8)).toBeRoughly([0.6, 0.8])
	);

	it('interpolated value', () =>
		expect(stickDeadZone([0.8, 0.8], 0.2, 1)).toBeRoughly([Math.SQRT1_2, Math.SQRT1_2])
	);
});
