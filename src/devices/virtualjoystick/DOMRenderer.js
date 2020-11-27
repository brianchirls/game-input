export default function domRenderer(control, options = {}) {
	const { device } = control;
	const {
		innerRadius = Math.max(24, device.radius / 4),
		parentElement = document.body
	} = options;

	const outer = document.createElement('div');
	Object.assign(outer.style, {
		position: 'fixed',
		pointerEvents: 'none',
		borderRadius: 999e20 + 'px',

		transition: 'opacity 0.1s',

		//temp
		backgroundColor: 'rgba(128, 128, 128, 0.5)'
	});

	const inner = document.createElement('div');
	Object.assign(inner.style, {
		position: 'fixed',
		pointerEvents: 'none',
		borderRadius: 999e20 + 'px',

		transition: 'opacity 0.1s',

		//temp
		backgroundColor: 'rgba(128, 128, 128, 0.5)'
	});
	outer.appendChild(inner);

	let rafId = 0;

	function render() {
		const [x, y] = control.read();

		if (control.mode === 'static' || x || y) {
			const outerSize = device.radius * 2;
			const ox = device.x - device.radius;
			const oy = device.y - device.radius;

			outer.style.left = ox + 'px';
			outer.style.top = oy + 'px';
			outer.style.width = outer.style.height = outerSize + 'px';
			outer.style.opacity = 1;

			const innerSize = innerRadius * 2;

			inner.style.left = device.x + x * device.radius - innerRadius + 'px';
			inner.style.top = device.y - y * device.radius - innerRadius + 'px';
			inner.style.width = inner.style.height = innerSize + 'px';
			inner.style.opacity = 1;
		} else {
			outer.style.opacity = 0;
			inner.style.opacity = 0;
		}

		rafId = requestAnimationFrame(render);
	}

	parentElement.appendChild(outer);

	rafId = requestAnimationFrame(render);

	return {
		destroy: () => {
			cancelAnimationFrame(rafId);

			if (outer.parentNode) {
				outer.parentNode.removeChild(outer);
			}
		}
	};
}
