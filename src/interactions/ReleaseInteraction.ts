import { Action } from '..';
import Interaction from './Interaction';

export default class ReleaseInteraction extends Interaction<any> {
	pressPoint = 0.5;

	constructor(action: Action<any>, pressPoint?: number) {
		super(action);

		if (typeof pressPoint === 'number' && pressPoint >= 0) {
			this.pressPoint = pressPoint;
		}

		let pressed = false;
		let timeout = 0;

		this.evaluate = () => {
			clearTimeout(timeout);

			const wasPressed = pressed;
			pressed = (this.action.activeControl?.magnitude() || 0) >= this.pressPoint;

			if (pressed) {
				return 0.5;
			}

			/*
			Reset to ready immediately after completed
			Warning: this happens asynchronously.
			*/
			if (wasPressed) {
				timeout = <number><unknown>setTimeout(this.update, 0);
				return 1;
			}

			return 0;
		};
	}
}
