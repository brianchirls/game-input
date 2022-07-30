import Gamepad from '../src/devices/Gamepad';
// import Pointer from '../src/devices/Pointer';
import Keyboard from '../src/devices/Keyboard';
import AxisComposite from '../src/controls/AxisComposite';
import Action from '../src/Action';
import VirtualStick from '../src/devices/VirtualStick';
import domView from '../src/devices/virtualstick/domView';

import './breakout.css';
import PressInteraction from '../src/interactions/PressInteraction';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const scoreContainer = document.createElement('div');
scoreContainer.id = 'score';
document.body.appendChild(scoreContainer);

const livesContainer = document.createElement('div');
livesContainer.id = 'lives';
document.body.appendChild(livesContainer);

const startButton = document.createElement('button');
startButton.id = 'start-button';
startButton.innerText = 'Start Game';
document.body.appendChild(startButton);

/**
 * Initialize Controls
 */
const gamepad = new Gamepad();
// const pointer = new Pointer({
// 	touch: false
// });

const kbd = new Keyboard({
	keyCode: true
});
const arrowKeys = new AxisComposite({
	negative: kbd.getControl('arrowleft'),
	positive: kbd.getControl('arrowright')
});
const WASDKeys = new AxisComposite({
	negative: kbd.getControl('KeyA'),
	positive: kbd.getControl('KeyD')
});

const virtualStick = new VirtualStick({
	lockY: true,
	element: canvas
}).getControl();
domView(virtualStick);

const moveAction = new Action({
	bindings: [
		gamepad.getControl('leftStick').x,
		gamepad.getControl('rightStick').x,
		arrowKeys,
		WASDKeys,
		virtualStick.x/*,
		{
			control: pointer.getControl('delta').find('x'),
			processors: [
				val => val / 10
			]
		}*/
	]
});

const pressStart = new PressInteraction(
	new Action([
		gamepad.getControl('start'),
		kbd.getControl('Enter')
	])
);

const sceneWidth = 480;
const sceneHeight = 320;

const canvasX = (x: number) => x / sceneWidth * canvas.width;
const canvasY = (y: number) => y / sceneHeight * canvas.height;
const canvasDistance = canvasX;

// constants
const paddleSpeed = 500 / 1000; // pixels per 1000ms
const ballSpeed = 60 / 1000;
const ballRadius = 6;
const paddleHeight = 12;
const paddleWidth = 60;
const brickColumns = 10;
const brickRows = 5;
const brickWidth = 30;
const brickHeight = 12;
const brickPadding = 12;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// game state
let playing = false;
let x = sceneWidth / 2;
let y = sceneHeight - 30;
let dx = 2;
let dy = -2;
let paddleX = (sceneWidth - paddleWidth) / 2;
let score = 0;
let drawScale = 1;
let lives = 3;

const bricks = [];

function drawBall() {
	ctx.beginPath();
	ctx.arc(canvasX(x), canvasY(y), canvasDistance(ballRadius), 0, Math.PI * 2);
	ctx.fillStyle = '#CCC';
	ctx.fill();
	ctx.closePath();
}
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(canvasX(paddleX), canvasY(sceneHeight - paddleHeight), canvasDistance(paddleWidth), canvasDistance(paddleHeight));
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (let row = 0; row < brickRows; row++) {
		const hue = 300 * row / brickRows;
		ctx.fillStyle = `hsl(${hue}, 90%, 50%)`;
		for (let col = 0; col < brickColumns; col++) {
			if (bricks[row][col].status === 1) {
				const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
				const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[row][col].x = brickX;
				bricks[row][col].y = brickY;
				ctx.beginPath();
				ctx.rect(canvasX(brickX), canvasY(brickY), canvasDistance(brickWidth), canvasDistance(brickHeight));
				// ctx.fillStyle = '#0095DD';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}
function drawScore() {
	scoreContainer.innerText = 'Score: ' + score;
}
function drawLives() {
	livesContainer.innerText = 'Lives: ' + lives;
}

function initialize() {
	bricks.length = 0;
	for (let c = 0; c < brickRows; c++) {
		bricks[c] = [];
		for (let r = 0; r < brickColumns; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}

	playing = false;
	x = sceneWidth / 2;
	y = sceneHeight - 30;
	dx = 2;
	dy = -2;
	paddleX = (sceneWidth - paddleWidth) / 2;
	score = 0;
	drawScale = 1;
	lives = 3;
}

function startGame() {
	initialize();
	playing = true;
	startButton.style.display = 'none';
}
startButton.onclick = startGame;

function endGame() {
	playing = false;
	startButton.style.display = '';
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
}

let last = performance.now();
function update(t = performance.now()) {
	const delta = t - last;
	last = t;

	gamepad.update();

	paddleX += moveAction.value * paddleSpeed * delta;
	paddleX = Math.max(0, Math.min(paddleX, sceneWidth - paddleWidth));

	const motionScale = ballSpeed * delta;
	x += dx * motionScale;
	y += dy * motionScale;

	// move ball
	if (x + dx > sceneWidth - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		// bounce against ceiling
		dy = -dy;
	} else if (y + dy > sceneHeight - ballRadius - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
		// bounce against paddle
		dy = -Math.abs(dy);
	} else if (y + dy > sceneHeight - ballRadius) {
		if (playing) {
			lives--;
			if (!lives) {
				console.log('GAME OVER');
				endGame();
			} else {
				// recent to paddle
				x = sceneWidth / 2;
				y = sceneHeight - 30;
				dx = 3;
				dy = -3;
				paddleX = (sceneWidth - paddleWidth) / 2;
			}
		} else {
			//bounce against floor
			dy = -dy;
		}
	}

	if (playing) {
		// brick collision detection
		const loX = x - ballRadius;
		const hiX = x + ballRadius;
		const loY = y - ballRadius;
		const hiY = y + ballRadius;
		for (let c = 0; c < brickRows; c++) {
			for (let r = 0; r < brickColumns; r++) {
				const b = bricks[c][r];
				if (b.status === 1) {
					if (hiX > b.x && loX < b.x + brickWidth && hiY > b.y && loY < b.y + brickHeight) {
						dy = -dy;
						b.status = 0;
						score++;
						if (score === brickColumns * brickRows) {
							console.log('YOU WIN, CONGRATS!');
							endGame();
						}
					}
				}
			}
		}
	}

	draw();

	requestAnimationFrame(update);
}

function resize() {
	const aspectRatio = sceneWidth / sceneHeight;
	const screenAspectRatio = window.innerWidth / window.innerHeight;
	drawScale = screenAspectRatio > aspectRatio ?
		window.innerHeight / sceneHeight :
		window.innerWidth / sceneWidth;
	// drawScale = Math.min(drawScale, 2);
	canvas.width = drawScale * sceneWidth * devicePixelRatio;
	canvas.height = drawScale * sceneHeight * devicePixelRatio;
	// todo: redraw?
}

resize();
initialize();

update();

pressStart.on('complete', () => {
	if (!playing) {
		startGame();
	}
});
