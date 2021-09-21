import createAutocomplete from './autocomplete.js';

let leftMovie = null;
let rightMovie = null;

async function searchMovies(searchString) {
	try {
		const response = await axios.get('https://www.omdbapi.com/', {
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
		return [];
	}
}

async function findMovieById(imbdID) {
	try {
		const response = await axios.get('https://www.omdbapi.com/', {
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

// Handle selection of an option in the dropdown (inject HTML movie details and return movie title).
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
	const leftElements = document.querySelectorAll('#left-summary article');
	const rightElements = document.querySelectorAll('#right-summary article');

	// Compare and style elements on the same "row" according to comparisson results.
	leftElements.forEach((leftElement, i) => {
		const rightElement = rightElements[i];
		const defaultClassList = ['notification'];

		// Only set comparisson colors of elements with numerical data (the ones with "notification" class).
		if (leftElement.classList.contains('notification')) {

			// Resetting classLists for easier conditional styling.
			leftElement.classList = defaultClassList.join(' ');
			rightElement.classList = defaultClassList.join(' ');

			// Because data-* attributes store values as strings.
			const leftElementValue = parseFloat(leftElement.dataset.value);
			const rightElementValue = parseFloat(rightElement.dataset.value);

			// Because the OMDB API sometimes has no data so it/we return a "N/A" string.
			if (isNaN(leftElementValue) || isNaN(rightElementValue)) {

				isNaN(leftElementValue) ? leftElement.classList.add('is-unavailable') : leftElement.classList.add('is-success');
				isNaN(rightElementValue) ? rightElement.classList.add('is-unavailable') : rightElement.classList.add('is-success');

			} else if (leftElementValue === rightElementValue) {
				leftElement.classList.add('is-success');
				rightElement.classList.add('is-success');
			} else if (leftElementValue > rightElementValue) {
				leftElement.classList.add('is-success');
				rightElement.classList.add('is-warning');
			} else {
				leftElement.classList.add('is-warning');
				rightElement.classList.add('is-success');
			}
		}
		equalizeHeights(leftElement, rightElement);
	});
}

function equalizeHeights(...args) {
	// Set the heights of the elements on the same row to the same height only when columns are side by side (large screens).
	if (document.body.clientWidth >= 768) {
		const heights = args.map((element) => {
			element.style.height = ''; // reset heights to allow resizing to smaller heights than previous.
			return parseFloat(getComputedStyle(element).height);
		});
		
		const equalizedHeight = Math.max(...heights);
	
		args.forEach((element) => {
			element.style.height = `${equalizedHeight}px`;
		});
	}
}

function movieTemplate(movieDetails) {
	const posterSRC = movieDetails.Poster === 'N/A' ? 'poster-not-found.png' : movieDetails.Poster; // The API assings the string "N/A" when no poster URL is found
	const metascore = parseInt(movieDetails.Metascore);
	const imdbRating = parseFloat(movieDetails.imdbRating);

	// Because some OMDB movies don't contain a Rotten Tomatoes object inside the Ratings array, must default to something to avoid error.
	const rottenTomatoes = () => {
		for (let rating of movieDetails.Ratings) {
			if (rating.Source === 'Rotten Tomatoes') return rating.Value;
		}
		return 'N/A';
	};

	// Because some OMDB movies don't contain a BoxOffice property, must default to something to avoid error.
	const boxOffice = movieDetails.BoxOffice ? parseInt(movieDetails.BoxOffice.replace(/[\$,]/g, '')) : 'N/A'; // Replaces any ocurrence of dolar sign or comma charachters with an empty string.

	// Because movieDetails.Awards is text of variable structure, awards will just be the sum of wins and nominations regardless of type.
	const awards = movieDetails.Awards.split(' ').reduce((awardsSum, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return awardsSum;
		} else {
			return awardsSum + value;
		}
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<div class="image"><img src="${posterSRC}"></div>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetails.Title}</h1>
					<h4>${movieDetails.Genre}</h4>
					<h6>${movieDetails.Rated}</h6>
					<p>${movieDetails.Plot}</p>
				</div>
			</div>
		</article>

		<article data-value="${awards}" class="notification is-success">
			<p class="title">${movieDetails.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value="${metascore}" class="notification is-success">
			<p class="title">${movieDetails.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value="${imdbRating}" class="notification is-success">
			<p class="title">${movieDetails.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value="${parseInt(rottenTomatoes())}" class="notification is-success">
			<p class="title">${rottenTomatoes()}</p>
			<p class="subtitle">Rotten Tomatoes</p>
		</article>
		<article data-value="${boxOffice}" class="notification is-success">
			<p class="title">${movieDetails.BoxOffice || boxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
	`;
}

// For when rotating screen makes viewport wide enough to display columns side by side
window.addEventListener('resize', runComparisson);

// CONFIGURATION OBJECT FOR THE AUTOCOMPLETE DROPDOWN COMPONENT ---------------------------------------------

const autoCompleteConfig = {
	fetchData(string) {
		// Wrapper function for semantics, createAutocomplete is application-agnostic and expects a function called fetchData
		return searchMovies(string);
	},
	renderOption(movie) {
		// Return the content of a dropdown option (poster, title, year)
		const posterSRC = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
			<img src="${posterSRC}">
			<span data-imdbid="${movie.imdbID}">${movie.Title} (${movie.Year})</span>
		`;
	},
};

createAutocomplete({
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) { // Wrapper function for semantics, createAutocomplete is application-agnostic and expects a function called onOptionSelect
		document.querySelector('.instructions').classList.add('is-hidden');
		return onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	},
	...autoCompleteConfig,
});

createAutocomplete({
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.instructions').classList.add('is-hidden');
		return onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	},
	...autoCompleteConfig,
});
