import mitt, {
	Handler,
	WildcardHandler
} from 'mitt';

type EventsBase = { [k: string]: unknown };

export default class EventEmitter<Events extends EventsBase> {
	on: {
		<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
		(type: '*', handler: WildcardHandler<Events>): void;
	};
	off: {
		<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
		(type: '*', handler: WildcardHandler<Events>): void;
	};
	protected emit: {
		<Key extends keyof Events>(type: Key, event: Events[Key]): void;
		<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
	};
	destroy: () => void;

	constructor() {
		const {
			all,
			on,
			off,
			emit
		} = mitt<Events>();

		this.on = on;
		this.off = off;
		this.emit = emit;
		this.destroy = () => all.clear();
	}
}