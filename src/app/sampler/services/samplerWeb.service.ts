import { Injectable, Inject } from '@angular/core';
import Tone from 'tone';
import { Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../utils/services/utils.service';
import { IFsService } from 'src/app/fs/services/fs.service';
import { Platform } from '@ionic/angular';
import { ISamplerService } from './sampler.service';

@Injectable({
	providedIn: 'root'
})
export class SamplerWebService implements ISamplerService {
	@Output()loaded: EventEmitter<String>;
	
	private isPlaying: boolean = false;

	play: () => void;
	stop: () => void;
	toggle: () => void;

	constructor(@Inject('IFsService') fsService: IFsService, utilsService: UtilsService, platform: Platform) {
		this.loaded = new EventEmitter<String>();
		let _self = this;

		let players = null;

		const config = {
			p1LoopTime: '35m',
			p2LoopTime: '35m'
		};

		let sampleNames = [
			// 'test_tone_3db_copy',
			// 'test_tone_3db',
			'cs-80_1',
			'cs-80_2',
			'cs-80_3',
			'cs-80_4',
			'cs-80_5',
			'cs-80_6',
			'cs-80_7',
			'cs-80_8',
			'pad_1',
			'pad_2',
			'pad_3',
			'pad_4',
			'pad_5',
			'pad_6',
			'pat1',
			'pat2',
			'piano1',
			'piano2',
			'piano3',
			'whales',
			'whistles'
		];

		let neonShimmerSampleNames = [
			'neon_shimmer_hiro_B_bass_1',
			'neon_shimmer_hiro_B_bass_2',
			'neon_shimmer_hiro_B_bass_3',
			'neon_shimmer_hiro_B_bass_4',
			'neon_shimmer_hiro_B_horn_1',
			'neon_shimmer_hiro_B_horn_2',
			'neon_shimmer_hiro_B_melody_1',
			'neon_shimmer_hiro_B_melody_10',
			'neon_shimmer_hiro_B_melody_11',
			'neon_shimmer_hiro_B_melody_12',
			'neon_shimmer_hiro_B_melody_13',
			'neon_shimmer_hiro_B_melody_14',
			'neon_shimmer_hiro_B_melody_15',
			'neon_shimmer_hiro_B_melody_2',
			'neon_shimmer_hiro_B_melody_3',
			'neon_shimmer_hiro_B_melody_4',
			'neon_shimmer_hiro_B_melody_5',
			'neon_shimmer_hiro_B_melody_6',
			'neon_shimmer_hiro_B_melody_7',
			'neon_shimmer_hiro_B_melody_8',
			'neon_shimmer_hiro_B_melody_9'
		];

		let sampleUrls = neonShimmerSampleNames.map(s => `assets/mp3/${s}.mp3`);

		
		platform.ready().then(onDeviceReady);
		function onDeviceReady() {
			console.log('creating Tone players');
			console.log('init audio buffers start');

			fsService.loadBuffersAsync(sampleUrls).then(results => {
				console.log('creating tone stuff with buff');
				console.log(results.length);

				let promises = [];

				results.forEach((r: any) => {
					promises.push(
						Tone.context
							.decodeAudioData(r.buffer)
							.then(ab => ({ url: r.url, audioBuffer: new Tone.Buffer(ab) }))
					);
				});

				Promise.all(promises).then(results => {
					console.log('all audio buffers decoded');
					let toneBuffers = results.reduce(
						(obj, item) => ((obj[item.url] = item.audioBuffer), obj),
						{}
					);
					players = new Tone.Players(toneBuffers).connect(masterFX);
					_self.loaded.emit();
					_self.loaded.complete();
				});
			});
		}

		var player1 = null;
		var player2 = null;
		var p1loop = null;
		var p2loop = null;

		// document.querySelector('#stopid').addEventListener('click', function() {
		// 	players.stopAll();
		// 	p1loop.stop();
		// 	p2loop.stop();
		// });

		Tone.Transport.bpm.value = 90;

		let masterFX = new Tone.MultibandCompressor({
			low: {
				threshold: -12,
				attack: 0.1,
				release: 0.5
			},
			mid: {
				threshold: -12,
				attack: 0.1,
				release: 0.5
			},
			high: {
				threshold: -24
			}
		});
		let gainCompensation = new Tone.Gain(1.2);
		let limiter = new Tone.Limiter(-3);
		let autopan = new Tone.AutoPanner({
			frequency: 0.3,
			type: 'triangle',
			depth: 0.3
		}).start();
		let reberb = new Tone.Reverb(3);
		let elefo = new Tone.LFO(3, 0.4, 0.7);
		elefo.type = 'triangle';
		elefo.start();
		elefo.connect(reberb.wet);
		reberb.generate();
		masterFX.chain(gainCompensation, limiter, autopan, reberb, Tone.Master);

		_self.play = play;
		_self.stop = () => {
			_self.isPlaying = false;
			players.stopAll();
			p1loop.stop();
		 	p2loop.stop();
		};

		_self.toggle = () => {
			
		};

		function play() {
			_self.isPlaying = true;
			console.log('pleey');

			if (Tone.context.state !== 'running') {
				Tone.context.resume();
			}

			p1loop = new Tone.Loop(function(time) {
				console.log('p1 time: ' + time);
				let random1 = sampleUrls[utilsService.getRandomInt(0, sampleUrls.length - 1)];
				console.log('p1 playing ' + random1);
				if (player1) {
					let player1ToFade = player1;
					player1ToFade.loop = false;
					player1ToFade.fadeOut = 0.5;
				}
				player1 = players.get(random1);
				player1.loop = true;
				player1.fadeIn = 0.5;
				player1.start(Tone.now());
			}, config.p1LoopTime).start(0);

			p2loop = new Tone.Loop(function(time) {
				console.log('p2 time: ' + time);
				let random1 = sampleUrls[utilsService.getRandomInt(0, sampleUrls.length - 1)];
				console.log('p2 playing ' + random1);
				if (player2) {
					let player2ToFade = player2;
					player2ToFade.loop = false;
					player2ToFade.fadeOut = 0.5;
				}
				player2 = players.get(random1);
				player2.fadeIn = 0.5;
				player2.start(Tone.now());
				player2.loop = true;
			}, config.p2LoopTime).start(0);

			Tone.Transport.start();
		}

		// document.querySelector('body').addEventListener('click', function() {
		// 	console.log('clicked');

		// 	if (Tone.context.state !== 'running') {
		// 		Tone.context.resume();
		// 	}

		// 	Tone.Transport.start();
		// });
	}

	start(): void {
		//this.started = true;
	}
}
