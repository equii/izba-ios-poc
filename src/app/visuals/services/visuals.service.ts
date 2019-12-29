import { Injectable } from '@angular/core';
import * as p5 from 'p5';
import * as p5dom from '../../../../node_modules/p5/lib/addons/p5.dom.js';
import { Output, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class VisualsService {
	private started = false;
	@Output() loaded = new EventEmitter();

	constructor() {
		let sketch = sketchFun;
		let _self = this;

		console.log(p5dom)

		function sketchFun(sk) {
			let sequences = [];
			let speed = 0.000001;
			let sequenceChangeRate = 0.0025;
			let scale = 33;
			let doClear = true;
			let doFade = true;
			let numSequences = 300;
			let pi = Math.PI;
			let alpha = 35;
			let fadeAlpha = 35;
			let modifierSwitch = false;
		
			let debugGui = {
				alphaSlider: null,
				fadeAlphaSlider: null,
				speedSlider: null,
				sequenceChangeRateSlider: null,
				scaleSlider: null,
				numSequencesSlider: null,
				modifierCheckBox: null,
				uiElements: []
			}

			function setup() {

				// let physicalScreenWidth = window.screen.width * window.devicePixelRatio;
				// let physicalScreenHeight = window.screen.height * window.devicePixelRatio;
	
				// let w = physicalScreenWidth;
				// let h = physicalScreenHeight;
				sk.createCanvas(window.screen.width, window.screen.height);
				sk.filter(sk.DILATE, 233);
				_createDebugGui();

				// centerX = sk.width / 2;
				// centerY = sk.height / 2;

				sk.blendMode(sk.BLEND);

				scale = sk.width / 25;
				sk.background(0);
				_setupSequence();

				_self.loaded.emit();
				_self.loaded.complete();
			}

			function mouseWheel(event) {
				if (event.delta < 0) { 

				} else {

				}
			}

			function keyPressed() {
				if (sk.keyCode === 68) {
					for (let i = 0; i < debugGui.uiElements.length; i++) {
						console.log(debugGui.uiElements[i].elt.style.visibility)
								if(debugGui.uiElements[i].elt.style.visibility !== 'hidden') {
									debugGui.uiElements[i].style('visibility', 'hidden')
								}
								else {
									debugGui.uiElements[i].style('visibility', 'visible')
								}
					}
				}
			}

			sk.draw = draw;
			sk.setup = setup;
			sk.mouseWheel = mouseWheel;
			sk.keyPressed = keyPressed;

			let totalTime = 0;

			function draw() {
				if(sequences.length !== numSequences) {
					_setupSequence();
				}

				totalTime += sk.deltaTime;
				let startAtX = 0; //-10;
				let startAtY = sk.height - 100; //height;

				alpha = debugGui.alphaSlider.value();
				speed = modifierSwitch ? debugGui.speedSlider.value() / 100000 : debugGui.speedSlider.value() / 1000;
				sequenceChangeRate = modifierSwitch ? debugGui.sequenceChangeRateSlider.value() / 10000 : debugGui.sequenceChangeRateSlider.value() / 100;
				scale = debugGui.scaleSlider.value();
				numSequences = debugGui.numSequencesSlider.value();
				fadeAlpha = debugGui.fadeAlphaSlider.value();

				if (doClear) sk.background(0);
				if (doFade) sk.background(_getNeonColor(fadeAlpha));
				
				let numberToDraw = sk.map(sk.noise(totalTime * sequenceChangeRate), 0, 1, 0, sequences.length);
				for (let i = 1; i < numberToDraw; i++) {
					let sequence = sequences[i];

					let modifier = modifierSwitch ? i : 1;

					let len = sk.noise(modifier * speed, 2*pi + modifier * speed) * scale;
					let angle = sk.map(sk.noise(totalTime * speed * modifier, 2*pi + totalTime * modifier * speed), 0, 1, 0.085, 0.65);

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

						let color = _getNeonColor(alpha);
					
						sk.stroke(color);

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

			function _getNeonColor(alpha) { 
				return sk.color(sk.random(220, 255), sk.random(0,30), sk.random(80, 150), alpha);
			}

			function _createDebugGui() {
				debugGui.alphaSlider = sk.createSlider(0, 255, alpha, 1);
				debugGui.alphaSlider.position(100, 20);
				debugGui.alphaSlider.style('width', '200px');
				
				let alphaSpan = sk.createSpan('prozorist\'')
				alphaSpan.position(10, 20);
				alphaSpan.style('color', '#fc03db');

				debugGui.fadeAlphaSlider = sk.createSlider(0, 255, fadeAlpha, 1);
				debugGui.fadeAlphaSlider.position(100, 40);
				debugGui.fadeAlphaSlider.style('width', '200px');

				let fadeAlphaSpan = sk.createSpan('gamselyt\'')
				fadeAlphaSpan.position(10, 40);
				fadeAlphaSpan.style('color', '#fc03db');
				
				debugGui.speedSlider = sk.createSlider(0, 1, 0.1, 0.01);
				debugGui.speedSlider.position(100, 60);
				debugGui.speedSlider.style('width', '400px');

				let speedSpan = sk.createSpan('skorost\'');
				speedSpan.position(10, 60);
				speedSpan.style('color', '#fc03db');

				debugGui.sequenceChangeRateSlider =  sk.createSlider(0, 1, 0.1, 0.01);
				debugGui.sequenceChangeRateSlider.position(100, 80);
				debugGui.sequenceChangeRateSlider.style('width', '400px');

				let sequenceSpan = sk.createSpan('merehtyt\'');
				sequenceSpan.position(10, 80);
				sequenceSpan.style('color', '#fc03db');
				
				debugGui.scaleSlider = sk.createSlider(0, 100, scale, 1);
				debugGui.scaleSlider.position(100, 100);
				debugGui.scaleSlider.style('width', '200px');

				let scaleSpan = sk.createSpan('velyki');
				scaleSpan.position(10, 100);
				scaleSpan.style('color', '#fc03db');

				debugGui.numSequencesSlider = sk.createSlider(0, 500, numSequences, 10);
				debugGui.numSequencesSlider.position(100, 120);
				debugGui.numSequencesSlider.style('width', '200px');

				let numSpan = sk.createSpan('kilkist\'');
				numSpan.position(10, 120);
				numSpan.style('color', '#fc03db');

				debugGui.modifierCheckBox = sk.createCheckbox('', false)
				debugGui.modifierCheckBox.changed(() => {
					modifierSwitch = debugGui.modifierCheckBox.checked();
				});
				debugGui.modifierCheckBox.position(100, 140);

				debugGui.uiElements.push(debugGui.alphaSlider);
				debugGui.uiElements.push(debugGui.fadeAlphaSlider);
				debugGui.uiElements.push(debugGui.speedSlider);
				debugGui.uiElements.push(debugGui.sequenceChangeRateSlider);
				debugGui.uiElements.push(debugGui.scaleSlider);
				debugGui.uiElements.push(debugGui.numSequencesSlider);
				debugGui.uiElements.push(debugGui.modifierCheckBox);
				debugGui.uiElements.push(alphaSpan);
				debugGui.uiElements.push(fadeAlphaSpan);
				debugGui.uiElements.push(speedSpan);
				debugGui.uiElements.push(sequenceSpan);
				debugGui.uiElements.push(scaleSpan);
				debugGui.uiElements.push(numSpan);


				debugGui.uiElements.forEach(e => e.style('visibility', 'hidden'));
			}
		}

		const P5 = new p5(sketch, 'canvas-holder');
	}

	start(): void {
		this.started = true;
	}
}
