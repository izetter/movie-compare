
// Writing HTML here to make this code more easily reusable
const root = document.querySelector('.autocomplete');
root.innerHTML = `
	<label><b>Search for a movie</b><input type="text" class="input"></label>
	<div class="dropdown">
		<div class="dropdown-menu">
			<div class="dropdown-content results"></div>
		</div>
	</div>
`;

const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');
const input = document.querySelector('input');

input.addEventListener('input', debounce(onInput, 500));

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

async function onInput(evt) {
	const movies = await searchMovies(evt.target.value);

	dropdown.classList.add('is-active');
	for (let movie of movies) {
		const option = document.createElement('a');
		option.classList.add('dropdown-item');
		option.innerHTML = `
			<img src="${movie.Poster}">
			${movie.Title}
		`;

		resultsWrapper.append(option);
	}
}









//////////////////////////////////////////////////

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
