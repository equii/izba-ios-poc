import { IFsService } from './fs.service';
import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/utils/services/utils.service';

@Injectable()
export class FsWebService implements IFsService {
	private utilsService : UtilsService;

	constructor(utilsService: UtilsService) {
		this.utilsService = utilsService;
		console.log('constructing FsWEbService');
	}

	public async loadBuffersAsync(urls: string[]) : Promise<object[]> {
		console.log('start loading buffers via XHR')
		let loadPromises = [];
		let getFileViaXHRAsync = this.utilsService.promisifyWrapper(this._getFileViaXHR);

		urls.forEach(url => {
			loadPromises.push(getFileViaXHRAsync(url));
		});

		let results = await Promise.all(loadPromises);

		results = results.map((v,i) => {
			let url = urls[i];
			return {
				url: url,
				buffer: v
			};
		});

		return Promise.resolve(results);
	}

	private _getFileViaXHR(url: string, callback: any) : void {
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";

		request.addEventListener("load", function(){
			if (request.status === 200){
				callback(null, request.response);
			} else {
				callback("Tone.Buffer: could not locate file: " + url, null);
			}
		});
		request.addEventListener("error", callback);
	
		request.send();
	}
}