# Game Input

A universal input manager for web games and interactive art. Built in Typescript. Loosely inspired by Unity's Input System. Needs a better name.

## Features

Built-in support for the following device types:

- Gamepad
- Keyboard
- Pointer (mouse, touch, pen)
- On-screen virtual stick

## Examples

- [Simple Movement](http://localhost:1000/examples/simple.html) ([code](https://github.com/brianchirls/game-input/blob/main/examples/simple.ts))
- [Accessible Menu Navigation](http://localhost:1000/examples/menu.html) ([code](https://github.com/brianchirls/game-input/blob/main/examples/menu.ts))
- [Breakout Clone](http://localhost:1000/examples/breakout.html) ([code](https://github.com/brianchirls/game-input/blob/main/examples/breakout.ts))

## Installation

### npm

Install via [npm](https://npmjs.com).

```sh
npm install @brianchirls/game-input
```

And import each class individually

```javascript
import Gamepad from '@brianchirls/game-input/devices/Gamepad';
import Action from '@brianchirls/game-input/Action';

```

### CDN

Or load directly from CDN
```html
<script src="https://unpkg.com/@brianchirls/game-input"></script>
```

And access classes on the global `GameInput` object.

```javascript
const myGamepad = new GameInput.Gamepad();
```

## Basic Example

```typescript
import Gamepad from '@brianchirls/game-input/devices/Gamepad';
import Keyboard from '@brianchirls/game-input/devices/Keyboard';
import DPadComposite from '@brianchirls/game-input/controls/DPadComposite';
import Action from '@brianchirls/game-input/Action';

/**
 * devices
 */

const gamepad = new Gamepad();
const keyboard = new Keyboard();

/**
 * get controls from each device
 */

const leftStick = gamepad.getControl('leftStick');

// It takes four keys to go in four directions
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

	// ... game logic goes here ...

	requestAnimationFrame(update);
}

update();

```

## License

[MIT License](https://github.com/brianchirls/game-input/blob/main/LICENSE) © Brian Chirls
