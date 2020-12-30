import StickInputControl from '../../controls/StickInputControl';

export default function VirtualJoystick({
	element = document.body,
	radius = 60,
	x = 0,
	y = 0,
	mode = 'dynamic',
	lockX = false,
	lockY = false,
	touch = true,
	pen = true,
	mouse = false,
	filter = null,
	touchActionStyle = true,
	enabled = true
} = {}) {

	let startEvent = null;
	let lastEvent = null;
	let startX = 0;
	let startY = 0;
	let deltaX = 0;
	let deltaY = 0;

	const isStatic = mode === 'static';
	const supported = mouse || pen || touch && navigator.maxTouchPoints > 0;

	const allowedPointerTypes = {
		pen,
		mouse,
		touch
	};

	/*
	For now, each device only handles one pointer at a time
	*/
	function pointerDown(evt) {
		if (!startEvent &&
			allowedPointerTypes[evt.pointerType] && (!filter || filter(evt))) {

			if (isStatic) {
				const dx = evt.offsetX - x;
				const dy = evt.offsetY - y;
				if (Math.hypot(dx, dy) > radius) {
					return;
				}

				startX = x;
				startY = y;
			} else {
				startX = evt.offsetX;
				startY = evt.offsetY;
			}

			startEvent = evt;
			lastEvent = evt;
		}
	}

	function pointerMove(evt) {
		if (startEvent && startEvent.pointerId === evt.pointerId) {
			lastEvent = evt;

			// calculate and set x/y
			const dx = lockX ? 0 : evt.offsetX - startX;
			const dy = lockY ? 0 : evt.offsetY - startY;
			const length = Math.hypot(dx, dy);

			const divisor = Math.max(length, radius);
			deltaX = dx / divisor;
			deltaY = -dy / divisor;
		}
	}

	function pointerUp(evt) {
		if (startEvent && startEvent.pointerId === evt.pointerId) {
			lastEvent = evt;
			startEvent = null;
		}
	}

	const styleElement = touchActionStyle && element.style ? element : document.body;

	function enable() {
		enabled = true;
		if (supported) {

			if (touchActionStyle) {
				styleElement.style.touchAction = 'none';
			}

			element.addEventListener('pointerdown', pointerDown);
			element.addEventListener('pointermove', pointerMove);
			element.addEventListener('pointerup', pointerUp);
			element.addEventListener('pointercancel', pointerUp);
		}
	}

	function disable() {
		enabled = false;
		if (touchActionStyle) {
			// todo: only if it wasn't set before
			styleElement.style.touchAction = '';
		}

		element.removeEventListener('pointerdown', pointerDown);
		element.removeEventListener('pointermove', pointerMove);
		element.removeEventListener('pointerup', pointerUp);
		element.removeEventListener('pointercancel', pointerUp);
	}

	this.getControl = (/*name,*/ options = {}) => {
		// if (typeof options === 'string') {
		// 	throw new Error('VirtualJoystick accepts options object');
		// }
		const read = () => {
			return startEvent ?
				[deltaX, deltaY] :
				StickInputControl.defaultValue;
		};

		return new StickInputControl(read, Object.assign(
			{},
			options,
			{
				device: this,
				active: () => !!startEvent
			}
		));
	};

	this.destroy = () => {
		disable();
	};

	Object.defineProperties(this, {
		pointerType: {
			get: () => lastEvent && lastEvent.pointerType || ''
		},

		connected: {
			enumerable: false,
			configurable: false,
			writable: false,
			value: supported
		},

		timestamp: {
			get: () => lastEvent && lastEvent.timeStamp || 0
		},

		element: {
			enumerable: false,
			configurable: false,
			writable: false,
			value: element
		},

		x: {
			get: () => isStatic ? x : startX,
			set: val => {
				x = val;
			}
		},

		y: {
			get: () => isStatic ? y : startY,
			set: val => {
				y = val;
			}
		},

		radius: {
			get: () => radius,
			set: val => {
				radius = val;
			}
		},

		enabled: {
			get: () => enabled,
			set(val) {
				if (!!val !== !!enabled) {
					if (val) {
						enable();
					} else {
						disable();
					}
				}
			}
		}
	});

	if (enabled) {
		enable();
	}
}
