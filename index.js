
let delayTimeout = null;

function delaySearch(str) {
	clearTimeout(delayTimeout);
	delayTimeout = setTimeout(() => {
		searchMovies(str);
	}, 500);
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

const input = document.querySelector('input');
input.addEventListener('input', (evt) => delaySearch(evt.currentTarget.value));


