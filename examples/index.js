import './index.css';

// open/close sidebar in mobile responsive view
const sidebar = document.getElementById('sidebar');
document.getElementById('menu-button').addEventListener('click', () => {
	sidebar.classList.toggle('open');
});

// track iframe src for updating url hash query
let selectedExample = null;
const iframe = document.getElementById('viewer');

function findExample(key) {
	return document.querySelector(`[data-src=${key}]`) || null;
}

function selectExample(key) {
	if (selectedExample) {
		selectedExample.classList.remove('selected');
	}

	selectedExample = findExample(key);
	if (selectedExample) {
		selectedExample.classList.add('selected');
		window.location.hash = key;
	}
}

// select initial example from URL hash
function loadExampleFromHash() {
	const key = window.location.hash.substr(1);
	const ex = key && findExample(key) || null;
	if (ex) {
		iframe.src = `../examples/${key}.html`;
	}
}

document.querySelectorAll('.category + ul > li[data-src] > a').forEach(link => {
	const key = link.parentNode.dataset.src;
	link.addEventListener('click', () => {
		selectExample(key);
		sidebar.classList.remove('open');
	});
});

window.addEventListener('hashchange', loadExampleFromHash);
loadExampleFromHash();

// set up category links
// disabled for now 'cause we don't have enough examples to make it worth it
// document.querySelectorAll('.sidebar-nav .category').forEach(category => {
// 	category.addEventListener('click', () => category.classList.toggle('open'));
// });

/*
todo:
- open currently selected category
- highlight currently selected example
- open example from URL query string
*/

/*
workaround for iOS issue where touch events in iframes don't
work unless the parent frame has an event listener
*/
window.addEventListener('touchstart', () => {});
