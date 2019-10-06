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
		let self = this;
		let s = sk => {
			sk.setup = () => {
				var cols, rows;
				var scl = 20;

				var physicalScreenWidth = window.screen.width * window.devicePixelRatio;
				var physicalScreenHeight = window.screen.height * window.devicePixelRatio;

				var w = physicalScreenWidth;
				var h = physicalScreenHeight;

				console.log(w);
				console.log(h);
		
				var flying = 0;
		
				var terrain = [];
		
				sk.createCanvas(window.screen.height, window.screen.width, sk.WEBGL);
				cols = w / scl;
				rows = h / scl;
		
				for (var x = 0; x < cols; x++) {
					terrain[x] = [];
					for (var y = 0; y < rows; y++) {
						terrain[x][y] = 0; //specify a default value for now
					}
				}

				function draw() {
					if(!self.started) {
						return;
					}

					flying -= 0.1;
					var yoff = flying;
					for (var y = 0; y < rows; y++) {
						var xoff = 0;
						for (var x = 0; x < cols; x++) {
							terrain[x][y] = sk.map(sk.noise(xoff, yoff), 0, 1, -100, 100);
							xoff += 0.2;
						}
						yoff += 0.2;
					}
		
					sk.background(0);
					sk.translate(0, 50);
					sk.rotateX(sk.PI / 3);
					sk.fill(200, 200, 200, 50);
					sk.translate(-w / 2, -h / 2);
					for (var y = 0; y < rows - 1; y++) {
						sk.beginShape(sk.TRIANGLE_STRIP);
						for (var x = 0; x < cols; x++) {
							sk.vertex(x * scl, y * scl, terrain[x][y]);
							sk.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
						}
						sk.endShape();
					}
				}
		
				sk.draw = draw;

				setTimeout(()=> {
					console.log('1visuals loaded')
					self.loaded.emit('visuals')
				})
			};
		};
		
		const P5 = new p5(s, 'canvas-holder');
  }

  start(): void {
		this.started = true;
  }
}