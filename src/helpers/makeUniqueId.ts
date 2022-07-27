export function makeUniqueId(n: number = 8) {
	let text = 'Education-';
	let possible =
		'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
	for (let i = 0; i < n; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
