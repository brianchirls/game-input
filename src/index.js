// everything for now

export { default as Action} from './Action';

// devices
export { default as Gamepad } from './devices/gamepad';
export { default as Keyboard } from './devices/keyboard';

// controls
export { default as InputControl } from './controls/InputControl';
export { default as AxisComposite } from './controls/AxisComposite';
export { default as AxisInputControl } from './controls/AxisInputControl';
export { default as ButtonInputControl } from './controls/ButtonInputControl';
export { default as DPadComposite } from './controls/DPadComposite';
export { default as StickInputControl } from './controls/StickInputControl';
export { default as Vector2InputControl } from './controls/Vector2InputControl';

// processors
export { default as axisDeadZone } from './processors/axisDeadZone';
export { default as stickDeadZone } from './processors/stickDeadZone';

// todo: export interactions when they're working

/*
# Components:

## Device Manager
- register device types
- notifications when devices are connected/disconnected
- options for polling, whatever?

## Actions?
- lifecycle
  - disabled
  - waiting
  - started
  - performed (completed)
  - canceled
- various bindings
	- action <-> control
	- processors
	- interactions
	- todo: groups, tags, whatever for control schemes

## Input types:

All buttons can optionally simulate float values with time delay

### Gamepad
- buttons (0-1, pressed?, touched?)
- axes

### Pointers
- buttons
- axes
- device types
  - mouse
  - touch
  - pen

### Keyboard
- only buttons

### Touch virtual gamepad

### Physical motion
- accelerometer/IMU
- Gyrometer
- Magnetometer
- XR pose

## Composites
- 1D axis
- 2D axis
- button with modifier(s)
- custom (3D?)

## Processors?
- dead zones (scalar and vectors)
- clamp (scalar and vectors)
- normalize vectors (2d, 3d?)
https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/Processors.html
https://github.com/ensemblejs/gamepad-api-mappings

## Interactions?
https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/Interactions.html
- press
- hold
- tap
- slowtap
- multitap
*/
