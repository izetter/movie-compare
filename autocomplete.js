function createAutocomplete({root, fetchData, renderOption, onOptionSelect}) {
	
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

		if (items.length === 0) {	// hide dropdown if request returns no matches (an empty array)
			dropdown.classList.remove('is-active');
			return;
		}

		resultsWrapper.innerHTML = '';	// deletes any previous results from the dropdown, and therefore, their event listener.
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
			input.value = await onOptionSelect(option);
			dropdown.classList.remove('is-active');
		}
	}

	// Debounce update of dropdown (debounce requests)
	input.addEventListener('input', debounce(onInput, 500));

	// If user clicks anywhere other than the autocomplete div or any child element of it, close the autocomplete.
	document.addEventListener('click', (evt) => {
		if (!root.contains(evt.target)) dropdown.classList.remove('is-active');
	});

	// Event delegation to update input value with clicked option
	resultsWrapper.addEventListener('click', onDropdwonClick);
}
