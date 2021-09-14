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
		return null; // Return null in case of an actual Error.
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


async function onMovieSelect(option) {
	const span = option.querySelector('span');

	const movieDetails = await findMovieById(span.dataset.imdbid);

	document.querySelector('#summary').innerHTML = movieTemplate(movieDetails);

	return span.textContent;

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

createAutocomplete({
	root: document.querySelector('.autocomplete'),
	async fetchData(string) {
		const response = await searchMovies(string);
		return response;
	},
	renderOption(movie) {
		const posterSRC = movie.Poster === 'N/A' ? '' : movie.Poster; // The API assings the string "N/A" when no poster URL is found
		return `
			<img src="${posterSRC}">
			<span data-imdbid="${movie.imdbID}">${movie.Title} (${movie.Year})</span>
		`;
	},
	onOptionSelect(option) {
		onMovieSelect(option);
	},
});
