import { Injectable } from '@angular/core';
import { promisify } from 'util';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {
	public getRandomInt(min: number, max: number) : number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	public promisifyWrapper(param: any) : any {
		return promisify(param);
	}
}