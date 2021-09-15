
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
		return [];
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

// Handle selection of an option in the dropdown (inject HTML movie details and return movie title)

let leftMovie = null;
let rightMovie = null;
async function onMovieSelect(option, summaryElement, side) {
	const span = option.querySelector('span');
	const movieDetails = await findMovieById(span.dataset.imdbid);
	summaryElement.innerHTML = movieTemplate(movieDetails);

	if (side === 'left') leftMovie = movieDetails;
	if (side === 'right') rightMovie = movieDetails;

	if (leftMovie && rightMovie) runComparisson();

	return span.textContent;
}

function runComparisson() {
	console.log('run compareishon');
}

function movieTemplate(movieDetails) {
	const boxOffice = parseInt(movieDetails.BoxOffice.replace(/[\$,]/g, '')); // Replaces any ocurrence of dolar sign or comma charachters with an empty string
	const metascore = parseInt(movieDetails.Metascore);
	const imdbRating = parseFloat(movieDetails.imdbRating);
	const imdbVotes = parseInt(movieDetails.BoxOffice.replace(/,/g, ''));

	const awards = movieDetails.Awards.split(' ').reduce((awardsSum, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return awardsSum;
		} else {
			return awardsSum + value;
		}
	}, 0)
	
	console.log(awards);

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

// CONFIGURATION OBJECT FOR THE AUTOCOMPLETE DROPDOWN

const autoCompleteConfig = {
	fetchData(string) {  	// Wrapper function for semantics, createAutocomplete is application-agnostic and expects a function called fetchData
		return searchMovies(string);
	},
	renderOption(movie) {	// Return the content of a dropdown option (poster, title, year)
		const posterSRC = movie.Poster === 'N/A' ? '' : movie.Poster; // The API assings the string "N/A" when no poster URL is found
		return `
			<img src="${posterSRC}">
			<span data-imdbid="${movie.imdbID}">${movie.Title} (${movie.Year})</span>
		`;
	},
}

createAutocomplete({
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) { // Wrapper function for semantics, createAutocomplete is application-agnostic and expects a function called onOptionSelect
		document.querySelector('.tutorial').classList.add('is-hidden');
		return onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	},
	...autoCompleteConfig,
});

createAutocomplete({
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		return onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	},
	...autoCompleteConfig,
});
