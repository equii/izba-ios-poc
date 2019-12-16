import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import { Output, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class VisualsService {
	private started = false;
	@Output() loaded = new EventEmitter();

	constructor() {
		let sketch = sketchFun;

		function sketchFun(sk) {
			let sequences = [];
			let speed = 0.003;
			let scale = 33;
			let doClear = false;
			let doFade = true;
			let numSequences = 200;
			let pi = Math.PI;
			let alpha = 6;
			let centerX, centerY;

			function setup() {
				// let physicalScreenWidth = window.screen.width * window.devicePixelRatio;
				// let physicalScreenHeight = window.screen.height * window.devicePixelRatio;
	
				// let w = physicalScreenWidth;
				// let h = physicalScreenHeight;
				sk.createCanvas(window.screen.width, window.screen.height);

				centerX = sk.width / 2;
				centerY = sk.height / 2;

				sk.blendMode(sk.BLEND);

				scale = sk.width / 20;
				sk.background(0);
				_setupSequence();
			}

			// function mouseWheel(event) {
			// 	if (event.delta < 0) {
			// 		alpha += 5;
			// 	} else {
			// 		alpha -= 5;
			// 	}

			// 	console.log(alpha);
			// }
			sk.draw = draw;
			sk.setup = setup;

			function draw() {
				let startAtX = 0; //-10;
				let startAtY = sk.height; //height;

				if (doClear) sk.background(0);
				if (doFade) sk.background(0, alpha + 10);

				for (let i = 1; i < sequences.length; i++) {
					let sequence = sequences[i];

					let len = sk.noise(sk.frameCount * speed, sk.frameCount * speed) * scale;
					let angle = sk.noise(sk.frameCount * speed, 2*pi + sk.frameCount * speed); 

					sk.resetMatrix();
					sk.translate(startAtX, startAtY);

					let mult = -1;
					if (sk.random(1) > 0.2) {
						mult = -1;
					}

					for (let j = 0; j < sequence.length; j++) {
						let value = sequence[j];
						if (value % 2 == 0) {
							sk.rotate(angle);
						} else {
							sk.rotate(-angle);
						}
						sk.strokeWeight(1);

						sk.stroke(255, alpha);

						sk.line(0, 0, 0, len * mult);
						sk.translate(0, len * mult);
					}
				}
			}

			function _setupSequence() {
				sequences = [];
				for (let i = 1; i < numSequences; i++) {
					let sequence = [];

					let n = i;
					do {
						sequence.push(n);
						n = _collatz(n);
					} while (n != 1);

					sequence.push(1);
					sequence.reverse();

					sequences.push(sequence);
				}
			}

			function _collatz(n) {
				if (n % 2 == 0) {
					return n / 2;
				} else {
					return (n * 3 + 1) / 2;
				}
			}
		}

		const P5 = new p5(sketch, 'canvas-holder');
	}

	start(): void {
		this.started = true;
	}
}
