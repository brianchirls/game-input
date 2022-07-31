# Game Input

A universal input manager for web games and interactive art. Built in Typescript. Loosely inspired by Unity's Input System. Needs a better name.

## Features

Built-in support for the following device types:

- Gamepad
- Keyboard
- Pointer (mouse, touch, pen)
- On-screen virtual stick

## Installation

Install via [npm](https://npmjs.com).

```sh
$ npm install @brianchirls/game-input
```

## Basic Example

```typescript

/**
 * devices
 */
import Gamepad from '../src/devices/Gamepad';
import Keyboard from '../src/devices/Keyboard';

const gamepad = new Gamepad();
const keyboard = new Keyboard();

/**
 * get controls from each device
 */

const leftStick = gamepad.getControl('leftStick');

// It takes four keys to go in four directions
import DPadComposite from '../src/controls/DPadComposite';
const kbdWASD = new DPadComposite({
	up: kbd.getControl('KeyW'),
	left: kbd.getControl('KeyA'),
	down: kbd.getControl('KeyS'),
	right: kbd.getControl('KeyD')
});

/**
 * Combine controls into actions.
 * The action will respond to whichever control is used.
 */

import Action from '../src/Action';
const moveAction = new Action({
	bindings: [
		leftStick,
		kbdWASD
	]
});

/**
 * Access action values inside update loop.
 */
function update() {
	// gamepad is a polling device and won't work unless
	// we update on every frame
	gamepad.update();

	const [x, y] = moveAction.value;

	// ...

	requestAnimationFrame(update);
}

update();

```

## License

[MIT License](https://github.com/brianchirls/game-input/blob/main/LICENSE) © Brian Chirls
