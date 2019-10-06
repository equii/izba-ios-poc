import { IFsService } from './fs.service';
import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/utils/services/utils.service';

declare var cordova: any;

declare global {
  interface Window { requestFileSystem: any; resolveLocalFileSystemURL: any }
}

@Injectable()
export class FsLocalService implements IFsService {

	private utilsService : UtilsService;

	constructor(utilsService: UtilsService) {
		this.utilsService = utilsService;
		console.log('constructing FsLocalService');
	}

	public async loadBuffersAsync(urls: string[]) : Promise<object[]> {
		console.log('start loading buffers')
		let _fetchLocalFileViaCordovaAsArrayBufferAsync = this.utilsService.promisifyWrapper(this._fetchLocalFileViaCordovaAsArrayBuffer);

		let loadPromises = [];

		urls.forEach(url => {
			loadPromises.push(_fetchLocalFileViaCordovaAsArrayBufferAsync(url));
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

	private _fetchLocalFileViaCordovaAsArrayBuffer(filename: string, callback: (error: any, result: any) => void)
	{
		var path = cordova.file.applicationDirectory + "www/" + filename;

		window.resolveLocalFileSystemURL(path, (entry: any) =>
		{
			console.log('file resolved')
			entry.file((file) => {
				let reader = new FileReader();

				reader.onload = function (e: any)
				{
					console.log('file reader loaded')
					callback(null, e.target.result);
				};

				reader.readAsArrayBuffer(file);
			}, (err) => callback(err, null));
		}, (err) => callback(err, null));
	}
}