import axisDeadZone from './axisDeadZone';

export default function stickDeadZone(value: [number, number], min: number, max: number) {
	const [x, y] = value;
	const magnitude = Math.hypot(x, y);
	const newMagnitude = axisDeadZone(magnitude, min, max);

	if (newMagnitude === 0) {
		return [0, 0];
	}

	const scale = newMagnitude / magnitude;
	return [x * scale, y * scale];
}
