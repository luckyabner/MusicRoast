declare module 'dom-to-image-more' {
	export function toPng(node: HTMLElement, options?: Record<string, unknown>): Promise<string>;
	export function toJpeg(node: HTMLElement, options?: Record<string, unknown>): Promise<string>;
	export function toBlob(node: HTMLElement, options?: Record<string, unknown>): Promise<Blob>;
	export function toPixelData(
		node: HTMLElement,
		options?: Record<string, unknown>
	): Promise<Uint8Array>;
	export function toSvg(node: HTMLElement, options?: Record<string, unknown>): Promise<string>;
	const domToImageMore = {
		toPng,
		toJpeg,
		toBlob,
		toPixelData,
		toSvg,
	};

	export default domToImageMore;
}
