declare module '*.png'
declare module '*.jpeg'
declare module '*.jpg'
declare module '*.css' {
	const css: { [key: string]: string }
	export default css
}
