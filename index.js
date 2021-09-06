const input = document.querySelector('input');
let delayTimeout = null;

function delaySearch(evt) {
	clearTimeout(delayTimeout);
	delayTimeout = setTimeout(() => {
		searchMovies(evt.target.value);
	}, 1000);
}

async function searchMovies(searchString) {
	try {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'a23e8576',
				s: searchString,
			},
		});
		console.log(response.data);
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

input.addEventListener('input', delaySearch);
