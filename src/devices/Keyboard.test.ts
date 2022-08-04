/**
 * @jest-environment jsdom
 * @jest-environment-options { "resources": "usable" }
 */
import ButtonInputControl from '../controls/ButtonInputControl';
import { Device } from '../Device';
import Keyboard from './Keyboard';

describe('Keyboard', () => {
	it('can be instantiated', () => {
		const keyboard = new Keyboard();
		expect(keyboard).not.toBeNull();
		expect(keyboard).toEqual(expect.any(Keyboard));
		expect(keyboard).toEqual(expect.any(Device));
		keyboard.destroy();
	});

	it('has correct default properties', () => {
		const keyboard = new Keyboard();
		expect(keyboard.connected).toBe(true);
		expect(keyboard.enabled).toBe(true);
		keyboard.destroy();
	});

	describe('getControl', () => {
		it('should return a ButtonInputControl', () => {
			const keyboard = new Keyboard();
			const control = keyboard.getControl('KeyA');
			expect(control).toBeInstanceOf(ButtonInputControl);
		});

		it('should set device property on control', () => {
			const keyboard = new Keyboard();
			const control = keyboard.getControl('KeyA');
			expect(control.device).toBe(keyboard);
		});

		it('should pass options to control constructor', () => {
			const keyboard = new Keyboard();
			const control = keyboard.getControl('KeyA', {
				pressPoint: 0.7,
				name: 'controlName'
			});
			expect(control.pressPoint).toBe(0.7);
			expect(control.name).toBe('controlName');
		});

		it('should set have no children, even if in options', () => {
			const keyboard = new Keyboard();
			const control = keyboard.getControl('KeyA', <any>{
				children: [
					new ButtonInputControl(() => 0)
				]
			});
			expect(control.children.size).toBe(0);
		});

		describe.each([
			[
				'name is key, no filter', // test title
				'KeyW', // name argument
				undefined, // options argument
				{ // expected keys
					w: true,
					x: false
				},
				'key:KeyW' // expected name
			],
			[
				'no name or filter - any key',
				'',
				undefined,
				{
					w: true,
					x: true
				},
				'any key'
			],
			[
				'filter is string, different from name',
				'w key',
				{ filter: 'KeyW' },
				{
					w: true,
					x: false
				},
				'w key'
			],
			[
				'filter is function',
				'w key',
				{ filter: (set: Set<string>) => set.has('KeyW') },
				{
					w: true,
					x: false
				},
				'w key'
			],
			[
				'filter is array',
				'w or b key',
				{ filter: ['KeyW', 'KeyW'] },
				{
					w: true,
					x: false
				},
				'w or b key'
			]
		])('%s', (title, name, options, expectedKeys, expectedName) => {
			it('should assign correct name', () => {
				const keyboard = new Keyboard();
				const control = keyboard.getControl(name, options);
				expect(control.name).toBe(expectedName);

				keyboard.destroy();
			});

			it('should set correct value (target key),', () => {
				const keyboard = new Keyboard();
				const control = keyboard.getControl(name, options);

				window.dispatchEvent(new KeyboardEvent('keydown', {
					code: 'KeyW',
					key: 'w'
				}));

				const value = control.read();
				expect(value).toBe(expectedKeys.w ? 1 : 0);

				keyboard.destroy();
			});

			it('should set correct value (other key),', () => {
				const keyboard = new Keyboard();
				const control = keyboard.getControl(name, options);

				window.dispatchEvent(new KeyboardEvent('keydown', {
					code: 'KeyX',
					key: 'x'
				}));

				const value = control.read();
				expect(value).toBe(expectedKeys.x ? 1 : 0);

				keyboard.destroy();
			});

			it('should read zero when released', () => {
				const keyboard = new Keyboard();
				const control = keyboard.getControl(name, options);

				// set all keys

				window.dispatchEvent(new KeyboardEvent('keydown', {
					code: 'KeyW',
					key: 'w'
				}));

				window.dispatchEvent(new KeyboardEvent('keydown', {
					code: 'KeyX',
					key: 'x'
				}));

				const value = control.read();
				expect(value).toBe(1);

				// key up
				window.dispatchEvent(new KeyboardEvent('keyup', {
					code: 'KeyW',
					key: 'w'
				}));

				expect(control.read()).toBe(expectedKeys.x ? 1 : 0);

				// key up
				window.dispatchEvent(new KeyboardEvent('keyup', {
					code: 'KeyX',
					key: 'x'
				}));

				expect(control.read()).toBe(0);

				keyboard.destroy();
			});

			it('should not read when disabled,', () => {
				const keyboard = new Keyboard({
					enabled: false
				});
				const control = keyboard.getControl(name, options);

				window.dispatchEvent(new KeyboardEvent('keydown', {
					code: 'KeyW',
					key: 'w'
				}));

				const value = control.read();
				expect(value).toBe(0);

				keyboard.destroy();
			});
		});

		it('should set value with key code', () => {
			const keyboard = new Keyboard({
				keyCode: false
			});
			const control = keyboard.getControl('w');

			window.dispatchEvent(new KeyboardEvent('keydown', {
				code: 'KeyW',
				key: 'w'
			}));

			const value = control.read();
			expect(value).toBe(1);

			keyboard.destroy();
		});

		it('should release with key value', () => {
			const keyboard = new Keyboard({
				keyCode: false
			});
			const control = keyboard.getControl('w');

			window.dispatchEvent(new KeyboardEvent('keydown', {
				code: 'KeyW',
				key: 'w'
			}));

			control.read();

			// key up
			window.dispatchEvent(new KeyboardEvent('keyup', {
				code: 'KeyW',
				key: 'w'
			}));

			const value = control.read();
			expect(value).toBe(0);

			keyboard.destroy();
		});
	});

	describe('.enabled', () => {
		it('can set .enabled from options', () => {
			const keyboard = new Keyboard({
				enabled: false
			});
			expect(keyboard.enabled).toBe(false);
			keyboard.destroy();
		});

		it('should not emit change event if not enabled', () => {
			const keyboard = new Keyboard({
				enabled: false
			});

			const onChange = jest.fn();
			keyboard.on('change', onChange);

			window.dispatchEvent(new KeyboardEvent('keydown', {
				code: 'KeyW',
				key: 'w'
			}));

			window.dispatchEvent(new KeyboardEvent('keyup', {
				code: 'KeyW',
				key: 'w'
			}));

			expect(onChange).not.toHaveBeenCalled();
			keyboard.destroy();
		});

		it('should emit \'enable\' event when set to true', () => {
			const keyboard = new Keyboard({
				enabled: false
			});

			const onEnable = jest.fn();
			keyboard.on('enable', onEnable);

			const onDisable = jest.fn();
			keyboard.on('disable', onDisable);

			keyboard.enabled = false; // redundant, do nothing
			expect(onEnable).not.toHaveBeenCalled();
			expect(onDisable).not.toHaveBeenCalled();

			keyboard.enabled = true;
			expect(onEnable).toHaveBeenCalled();
			expect(onDisable).not.toHaveBeenCalled();
			keyboard.destroy();
		});

		it('should emit \'disable\' event when set to false', () => {
			const keyboard = new Keyboard({
				enabled: true
			});

			const onEnable = jest.fn();
			keyboard.on('enable', onEnable);

			const onDisable = jest.fn();
			keyboard.on('disable', onDisable);

			keyboard.enabled = true; // redundant, do nothing
			expect(onEnable).not.toHaveBeenCalled();
			expect(onDisable).not.toHaveBeenCalled();

			keyboard.enabled = false;
			expect(onEnable).not.toHaveBeenCalled();
			expect(onDisable).toHaveBeenCalled();
			keyboard.destroy();
		});
	});

	describe('destroy', () => {
		it('should set enabled to false', () => {
			const keyboard = new Keyboard();
			expect(keyboard.enabled).toBe(true);
			keyboard.destroy();
			expect(keyboard.enabled).toBe(false);
		});

		it('should not allow setting enabled to true', () => {
			const keyboard = new Keyboard();
			keyboard.destroy();
			keyboard.enabled = true;
			expect(keyboard.enabled).toBe(false);
		});

		it('should remove event listeners', () => {
			const keyboard = new Keyboard();
			const mock = jest.fn();
			keyboard.on('change', mock);
			keyboard.destroy();
			keyboard.emit('change');
			expect(mock).not.toHaveBeenCalled();
		});
	});
});
