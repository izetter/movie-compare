
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

	if (movies === null || movies.length === 0) {	// hide the dropdown if searchMovies' request fails or returns no matches (the empty array)
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
			<span data-imdbid="${movie.imdbID}">${movie.Title}</span>
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
		console.dir(err);
		return null;	// Return null in case of an actual Error.
	}
}

async function onMovieSelect(evt) {
	const option = evt.target.closest('a');
	if (resultsWrapper.contains(option)) {
		const span = option.querySelector('span');
		input.value = span.textContent;
		dropdown.classList.remove('is-active');
		const movieDetails = await findMovieById(span.dataset.imdbid);
		document.querySelector('#summary').innerHTML = movieTemplate(movieDetails);
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
		return response.data;
	} catch (err) {
		console.log(err);
	}
}

function movieTemplate(movieDetails) {
	return `
		<article class="media">
			<figure class="media-left">
				<p class="image"><img src="${movieDetails.Poster}"></p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetails.Title}</h1>
					<h4>${movieDetails.Genre}</h4>
					<p>${movieDetails.Plot}</p>
				</div>
			</div>
		</article>

		<article class="notification is-primary">
			<p class="title">${movieDetails.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article class="notification is-primary">
			<p class="title">${movieDetails.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
}


// Debounce update of dropdown (debounce requests)
input.addEventListener('input', debounce(onInput, 500));

// If user clicks anywhere other than the autocomplete div or any child element of it, close the autocomplete.
document.addEventListener('click', (evt) => {
	if (!root.contains(evt.target)) dropdown.classList.remove('is-active');
});

// Event delegation to update input value with clicked movie title
resultsWrapper.addEventListener('click', onMovieSelect);

























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


