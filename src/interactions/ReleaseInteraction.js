import Interaction from './Interaction';
export function ReleaseInteraction(pressPoint = 0.5) {
	Interaction.call(this);
	this.pressPoint = pressPoint;

	let pressed = false;

	this.update = binding => {
		const wasPressed = pressed;
		pressed = binding.control.magnitude() > this.pressPoint;

		if (pressed) {
			return 'active';
		}

		if (wasPressed) {
			return 'complete';
		}

		return '';
	};

	this.reset = () => {
		pressed = false;
	};
}

ReleaseInteraction.prototype = Object.create(Interaction.prototype);
