import InputControl from './controls/InputControl';
import EventEmitter from './util/EventEmitter';

export type DeviceOptions = {
	/**
	 * Determines initial value for `.enabled`, whether devices is initially
	 * enabled upon creation.
	 *
	 * default: true
	 */
	enabled?: boolean;
};

export type DeviceEvents = {
	change: unknown;
	[k: string]: unknown;
};

/**
 * An abstract class for hardware devices, such as {@link devices/Keyboard.Keyboard}.
 *
 * Extend this class to create new devices.
 */
export abstract class Device<DeviceEventsType extends DeviceEvents = DeviceEvents> extends EventEmitter<DeviceEventsType> {
	/**
	 * Create a new InputControl object attached to the device.
	 */
	getControl: (name: any, options?: any) => InputControl<any>;

	/**
	 * Remove any event listeners and free up any resources.
	 */
	declare destroy: () => void;

	/**
	 * Devices that are not enabled will not emit any events, and read operations
	 * will always return the default value, which is typically 0.
	 */
	enabled: boolean;

	/**
	 * `true` if device is currently connected.
	 */
	readonly connected: boolean;
}


export interface ThrottledDeviceOptions extends DeviceOptions {
	/**
	 * For {@link Device.ThrottledDevice | throttled devices}, `updatePeriod` determines the minimal
	 * length of time between samples. Shorter periods (and therefore higher frequency)
	 * might improve responsiveness but may impact performance and limit accuracy
	 * of "delta" values between samples.
	 */
	updatePeriod?: number;
}

/**
 * An abstract class for devices whose input may be throttled to prevent changes
 * happening too frequently. Derived classes typically take {@link Device.ThrottledDeviceOptions}
 * as a constructor argument.
 *
 * Extend this class to create new throttled devices.
 */
export abstract class ThrottledDevice<DeviceEventsType extends DeviceEvents = DeviceEvents> extends Device<DeviceEventsType> {
	/**
	 * The time (DOMHighResTimeStamp) of the last input read from the device hardware,
	 * in milliseconds, representing time since "time origin," or the beginning of
	 * the document's lifetime.
	 */
	readonly timestamp: number;
}

/**
 * An abstract class for devices that require polling, since the underlying hardware
 * API may not provide any events triggered by value changes.
 *
 * Extend this class to create new polling devices.
 */
export abstract class PollingDevice<DeviceEventsType extends DeviceEvents = DeviceEvents> extends ThrottledDevice<DeviceEventsType> {
	/**
	 * The `update` method must be called during the game loop, typically `requestAnimationFrame`
	 * for the device to emit changes and update read values.
	 */
	declare update: () => void;
}
