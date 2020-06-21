export default function axisDeadZone(value, min = 0.125, max = 0.925) {
	const absValue = Math.abs(value);
	if (absValue < min) {
		return 0;
	}
	if (absValue > max) {
		return Math.sign(value);
	}

	return Math.sign(value) * (absValue - min) / (max - min);
}
