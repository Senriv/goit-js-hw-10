import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  search: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.search.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(evt) {
  if (evt.target.value.trim() === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  fetchCountries(evt.target.value.trim())
    .then(array => {
      if (array.length > 10) {
        manyAnswers();
      } else if (array.length === 1) {
        renderCard(array);
      } else if (array.length >= 2 && array.length <= 10) {
        renderList(array);
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name!');
      } else {
        Notiflix.Notify.failure(error.message);
      }
    });
}

function manyAnswers() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function renderList(array) {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = array
    .map(({ flags, name }) => {
      return `<li class="list-item">
      <img src="${flags.svg}" width="70" alt="${flags.alt}">
      <h2>${name.common}, (${name.official})</h2>
    </li>`;
    })
    .join('');
}

function renderCard(array) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = array
    .map(({ capital, flags, languages, name, population }) => {
      return `<img src="${flags.svg}" width="100" alt="${flags.alt}">
    <h2>${name.common}, (${name.official})</h2>
    <p>Capital: ${capital}</p>
    <p>Languages: ${Object.values(languages).join(', ')}</p>
    <p>Population: ${population}</p>`;
    })
    .join('');
}
