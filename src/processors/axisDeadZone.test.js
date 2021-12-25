import axisDeadZone from './axisDeadZone';

describe('axisDeadZone', () => {
	it('middle value', () => expect(axisDeadZone(0.5, 0.1, 0.9)).toBeRoughly(0.5));
	it('low value', () => expect(axisDeadZone(0.1, 0.2, 0.9)).toBe(0));
	it('high value', () => expect(axisDeadZone(0.9, 0.1, 0.8)).toBe(1));
	it('interpolated value', () => expect(axisDeadZone(0.8, 0.2, 1)).toBeRoughly(0.75));

	it('should work without min and max', () => expect(axisDeadZone(0.525)).toBeRoughly(0.5));

});
