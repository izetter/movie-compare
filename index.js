
// Writing HTML here to make this code more easily reusable as all the needed HTML for the search and autocomplete functionality
// is created here in this file. Only the "root" variable needs to reference to an existing element created in the HTML file.
const root = document.querySelector('.autocomplete');
root.innerHTML = `
	<label for="input"><b>Search for a movie</b></label>
	<input type="text" class="input" id="input">
	<div class="dropdown">
		<div class="dropdown-menu">
			<div class="dropdown-content results"></div>
		</div>
	</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

async function onInput(evt) {
	const movies = await searchMovies(evt.target.value);

	if (movies.length === 0) {	// hide the dropdown if searchMovies returns no matches (the empty array)
		dropdown.classList.remove('is-active');
		return;
	}

	resultsWrapper.innerHTML = '';	// deletes any previous results from the dropdown, and therefore, their event listeners.
	dropdown.classList.add('is-active');
	for (let movie of movies) {
		const option = document.createElement('a');	// dropdown option
		const posterSRC = movie.Poster === 'N/A' ? '' : movie.Poster;	// The API assings the string "N/A" when no poster URL is found

		option.classList.add('dropdown-item');
		option.innerHTML = `
			<img src="${posterSRC}">
			<span>${movie.Title}</span>
		`;

		resultsWrapper.append(option);
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

		// If the OMBD API can't find any matching movies, its response will contain a string property called "Error",
		// But it's not really an error though, the request is still succesful, it's just how they designed the API.
		if (response.data.Error) return [];

		return response.data.Search;
	} catch (err) {
		console.log(err);
	}
}

input.addEventListener('input', debounce(onInput, 500));

// If user clicks anywhere other than the autocomplete div or any child element of it, close the autocomplete.
document.addEventListener('click', (evt) => {
	if (!root.contains(evt.target)) dropdown.classList.remove('is-active');
});

// Event delegation to update input value with clicked movie title
resultsWrapper.addEventListener('click', (evt) => {
	const anchorTag = evt.target.closest('a');
	if (resultsWrapper.contains(anchorTag)) {
		dropdown.classList.remove('is-active');
		input.value = anchorTag.querySelector('span').textContent;
	}
});








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
