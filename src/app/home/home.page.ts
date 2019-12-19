import { Component, Inject } from '@angular/core';
import { VisualsService } from '../visuals/services/visuals.service';
import { ISamplerService } from '../sampler/services/sampler.service';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
	constructor(private visuals: VisualsService, @Inject('ISamplerService') private sampler: ISamplerService) {
    this.visuals.start();

    //let allLoaded = forkJoin(sampler.loaded, visuals.loaded);
  }

	pley() {

	}
}
