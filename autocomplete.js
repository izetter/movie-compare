
////////// Creates a dropdown component that  with the elements  items from the value of an

/* 
Must pass a "configuation object" to createAutocomplete.

It must contain the following:

1. A property containg an HTML element that will serve as the root of the autocomplete structure.
2. A function that upon execution renders (injects) the application specific HTML for the dropdown option.
3. 

As is, the autocomplete is designed with a dropdown structure similar to the one Bulma uses for its dropdown components,
which uses anchor elements as the dropdown options.
Following that structure also facilitates styling using the Bulma library, which is intended to be used as can be noted
by the class names used. However

*/

function createAutocomplete({root, fetchData, renderOption, onOptionSelect}) {
	
	// Writing HTML here to make this code more easily reusable as all the needed HTML for the search and autocomplete functionality
	// is created here in this file. Only the "root" variable needs to reference to an existing element created in the HTML file.

	root.innerHTML = `
		<label for="input"><b>Search</b></label>
		<input type="text" class="input" id="input">
		<div class="dropdown">
			<div class="dropdown-menu">
				<div class="dropdown-content results"></div>
			</div>
		</div>
	`;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');




	async function onInput(evt) {
		const items = await fetchData(evt.target.value);

		if (items === null || items.length === 0) {	// hide the dropdown if searchMovies' request fails or returns no matches (the empty array)
			dropdown.classList.remove('is-active');
			return;
		}

		resultsWrapper.innerHTML = '';	// deletes any previous results from the dropdown, and therefore, their event listeners.
		dropdown.classList.add('is-active');

		for (let item of items) {
			const option = document.createElement('a');	// dropdown option
			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);
			resultsWrapper.append(option);
		}
	}


	async function onDropdwonClick(evt) {
		const option = evt.target.closest('a');
		if (resultsWrapper.contains(option)) {

			dropdown.classList.remove('is-active');
			input.value = onOptionSelect(option);;

		}
	}




	// Debounce update of dropdown (debounce requests)
	input.addEventListener('input', debounce(onInput, 500));

	// If user clicks anywhere other than the autocomplete div or any child element of it, close the autocomplete.
	document.addEventListener('click', (evt) => {
		if (!root.contains(evt.target)) dropdown.classList.remove('is-active');
	});

	// Event delegation to update input value with clicked movie title
	resultsWrapper.addEventListener('click', onDropdwonClick);

}
