import html from 'html-loader!./menu.html';
import { Action } from '../src';
import Gamepad from '../src/devices/Gamepad';
import Keyboard from '../src/devices/Keyboard';
import PressInteraction from '../src/interactions/PressInteraction';
import './menu.css';

document.body.innerHTML = html;


// Get relevant elements and collections
const tabbed = document.querySelector('.tabbed');
const tablist = tabbed.querySelector('ul');
const tabs = Array.from(tablist.querySelectorAll('a'));
const panels = Array.from(tabbed.querySelectorAll('section'));

let currentTabIndex = 0;
function switchTabIndex(index: number) {
	while (index < 0) {
		index += tabs.length;
	}
	if (index >= tabs.length) {
		index = index % tabs.length;
	}

	const newTab = tabs[index];
	newTab.focus();

	// Set the selected state
	newTab.setAttribute('aria-selected', 'true');

	const oldTab = tabs[currentTabIndex];
	oldTab.removeAttribute('aria-selected');

	// Get the indices of the new and old tabs to find the correct
	// tab panels to show and hide
	panels[currentTabIndex].hidden = true;
	panels[index].hidden = false;
	currentTabIndex = index;

}
function switchTab(newTab: HTMLAnchorElement) {
	const index = Array.prototype.indexOf.call(tabs, newTab);
	switchTabIndex(index);
}

// Add the tablist role to the first <ul> in the .tabbed container
tablist.setAttribute('role', 'tablist');

tabs.forEach((tab, i) => {
	tab.setAttribute('role', 'tab');
	tab.setAttribute('id', 'tab' + (i + 1));
	tab.setAttribute('tabindex', '0');
	tab.parentElement.setAttribute('role', 'presentation');

	// Handle clicking of tabs for mouse users
	tab.addEventListener('click', e => {
		e.preventDefault();
		switchTab(tab);
	});
});

// Add tab panel semantics and hide them all
panels.forEach((panel, i) => {
	panel.setAttribute('role', 'tabpanel');
	panel.setAttribute('aria-labelledby', tabs[i].id);
	panel.hidden = true;
});

// Initially activate the first tab and reveal the first tab panel
// tabs[0].removeAttribute('tabindex');
tabs[0].setAttribute('aria-selected', 'true');
panels[0].hidden = false;


// Devices
const gamepad = new Gamepad();
const kbd = new Keyboard({ keyCode: true });

// Interactions
const tabLeft = new PressInteraction(new Action([
	kbd.getControl('PageUp'),
	gamepad.getControl('L1')
]));
const tabRight = new PressInteraction(new Action([
	kbd.getControl('PageDown'),
	gamepad.getControl('R1')
]));
// const itemUp = new PressInteraction(new Action([
// 	kbd.getControl('ArrowUp'),
// 	gamepad.getControl('dpadUp')
// ]));
// const itemDown = new PressInteraction(new Action([
// 	kbd.getControl('ArrowDown'),
// 	gamepad.getControl('dpadDown')
// ]));

tabLeft.on('complete', () => switchTabIndex(currentTabIndex - 1));
tabRight.on('complete', () => switchTabIndex(currentTabIndex + 1));

function update() {
	gamepad.update();
	setTimeout(update, 8);
}
update();
