import { Component } from '@angular/core';
import { VisualsService } from '../visuals/services/visuals.service';
import { SamplerService } from '../sampler/services/sampler.service';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
	constructor(private visuals: VisualsService, private sampler: SamplerService) {
    this.visuals.start();

    let allLoaded = forkJoin(sampler.loaded, visuals.loaded);
  }

	pley() {

	}
}
