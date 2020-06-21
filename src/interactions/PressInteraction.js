import Interaction from './Interaction';
export default class PressInteraction extends Interaction {
	pressPoint = 0.5;

	constructor(pressPoint) {
		super();

		if (pressPoint >= 0) {
			this.pressPoint = pressPoint;
		}
	}

	process(binding/*, action*/) {
		return binding.control.magnitude() > this.pressPoint ?
			'complete' :
			'inactive';
	}
}
