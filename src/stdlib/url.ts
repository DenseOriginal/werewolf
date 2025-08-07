export const setURLHash = (string: string) => {
	window.location.hash = `#${string}`;
}

export const getURLHash = () => {
	return window.location.hash.slice(1);
}