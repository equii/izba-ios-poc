export interface IFsService {
	loadBuffersAsync(urls: string[]) :  Promise<object[]>;
}