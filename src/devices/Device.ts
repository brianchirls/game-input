import { InputControlBase } from '../controls/InputControl';
import EventEmitter from '../util/EventEmitter';

export interface DeviceOptions {
	/**
	 * Determines initial value for `.enabled`, whether devices is initially
	 * enabled upon creation.
	 *
	 * default: true
	 */
	enabled?: boolean;
}

export type DeviceEvents = {
	change: unknown;
};

export abstract class Device<DeviceEventsType extends DeviceEvents = DeviceEvents> extends EventEmitter<DeviceEventsType> {
	/**
	 * Create a new InputControl object attached to the device.
	 */
	getControl: (name: string, options?: any) => InputControlBase;

	/**
	 * Remove any event listeners and free up any resources.
	 */
	declare destroy: () => void;

	/**
	 * Devices that are not enabled will not emit any events, and read operations
	 * will always return the default value. Typically 0.
	 */
	enabled: boolean;

	/**
	 * Whether a devices is currently connected.
	 */
	readonly connected: boolean;
}

export interface PollingDeviceOptions extends DeviceOptions {
	/**
	 * For devices that poll hardware, `updatePeriod` determines the minimal
	 * length of time between samples. Shorter periods (and therefore higher frequency)
	 * might improve responsiveness but may impact performance and limit accuracy
	 * of "delta" values between samples.
	 */
	updatePeriod?: number;
}

export abstract class PollingDevice<DeviceEventsType extends DeviceEvents = DeviceEvents> extends Device<DeviceEventsType> {
	/**
	 * The time (DOMHighResTimeStamp) of the last input read from the device hardware,
	 * in milliseconds, representing time since "time origin," or the beginning of
	 * the document's lifetime.
	 */
	readonly timestamp: number;
}