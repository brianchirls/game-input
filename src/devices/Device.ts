import { InputControlBase } from '../controls/InputControl';

export interface DeviceOptions {
	enabled?: boolean;
}

export interface Device {
	getControl: (name: string, options?: any) => InputControlBase;
	destroy: () => void;
	enabled: boolean;
	readonly connected: boolean;
}

export interface PollingDeviceOptions extends DeviceOptions {
	updatePeriod?: number;
}

export interface PollingDevice extends Device {
	readonly timestamp: number;
}