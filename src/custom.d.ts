/**
 * Ps type definitions.
 */

declare namespace Ps {
	export function initialize(element: any, config: any): void;
	export function destroy(element: any): void;
	export function update(element: any): void;
}

declare module "perfect-scrollbar" {
	export = Ps;
}
