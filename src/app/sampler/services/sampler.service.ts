import { EventEmitter } from '@angular/core';

export interface ISamplerService {
	loaded: EventEmitter<String>;
	play: () => void;
	stop: () => void;
	toggle: () => void;
}