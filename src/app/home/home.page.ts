import { Component, Inject } from '@angular/core';
import { VisualsService } from '../visuals/services/visuals.service';
import { ISamplerService } from '../sampler/services/sampler.service';
import { forkJoin, of } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
	constructor(private visuals: VisualsService, @Inject('ISamplerService') private sampler: ISamplerService) {
		let allLoaded = forkJoin(visuals.loaded, sampler.loaded);

		allLoaded.subscribe(values => {
			sampler.play();
		});

		document.querySelector('body').addEventListener('click', function() {
			sampler.toggle();
		});
  }

	pley() {

	}
}
