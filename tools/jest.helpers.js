// import { EPSILON } from 'gl-matrix/cjs/common';
const EPSILON = 0.00001;
const expect = global.expect;

expect.extend({
	toBeRoughly: function toBeRoughly(received, argument) {
		let pass = true;

		const stringify = typeof argument === 'object' && 'length' in argument ?
			val => JSON.stringify(Array.from(val)) :
			JSON.stringify;

		if (typeof argument === 'number') {
			pass = Math.abs(received - argument) < EPSILON;
		} else if (received.length !== argument.length) {
			pass = false;
		} else {
			for (let i = 0; i < received.length && pass; i++) {
				if (Array.isArray(received[i]) && Array.isArray(argument[i])) {
					pass = toBeRoughly(received[i], argument[i]);
				} else if (isNaN(received[i]) !== isNaN(argument[i])) {
					pass = false;
				} else if (Math.abs(received[i] - argument[i]) >= EPSILON) {
					pass = false;
				}
			}
		}

		const not = pass ? 'not ' : '';
		return {
			pass,
			message: () => `expected ${stringify(received)} ${not}to be roughly equal to ${stringify(argument)}`
		};
	}
});
