const input = document.querySelector('input');

input.addEventListener('input', debounce(onInput, 500));

function debounce(func, delay) {
	let timeoutId = null;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
}

async function onInput(evt) {
	const searchResults = await searchMovies(evt.target.value);
	console.log(searchResults);
}

async function searchMovies(searchString) {
	try {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'a23e8576',
				s: searchString,
			},
		});
		return response.data.Search;
	} catch (err) {
		console.log(err);
	}
}
















async function findMovieById(imbdID) {
	try {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'a23e8576',
				i: imbdID,
			},
		});
		console.log(response.data);
	} catch (err) {
		console.log(err);
	}
}

