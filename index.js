const input = document.querySelector('input');

input.addEventListener('input', debounce(onInput, 500));


async function onInput(evt) {
	const movies = await searchMovies(evt.target.value);
	console.log(movies);

	for (let movie of movies) {
		const div = document.createElement('div');

		div.innerHTML = `
			<h1>${movie.Title}</h1>
			<img src="${movie.Poster}">
		`;

		document.querySelector('#target').append(div);
		console.log(`${movie.Poster}`);
	}
}

async function searchMovies(searchString) {
	try {

		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'a23e8576',
				s: searchString,
			},
		});

		// The OMBD API response may contain a string property called "Error", which, if present, indicates that it couldn't find movies matching
		// the searchString. It's not really an error though, the request is still succesful, it's just how they designed the API.
		if (response.data.Error) return [];

		return response.data.Search;

	} catch (err) {
		console.log(err);
	}
}















function debounce(func, delay) {
	let timeoutId = null;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
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

