import { Action } from '..';
import Interaction from './Interaction';

export default class PressInteraction extends Interaction<any> {
	pressPoint = 0.5;

	constructor(action: Action<any>, pressPoint?: number) {
		super(action);

		if (pressPoint >= 0) {
			this.pressPoint = pressPoint;
		}
	}

	evaluate(): number {
		return (this.action.activeControl?.magnitude() || 0) >= this.pressPoint ? 1 : 0;
	}
}
