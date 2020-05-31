const themeToggle = document.querySelector('.color-toggle');
const searchField = document.querySelector('.form__input');
const regionSelect = document.querySelector('.form__select');
const countriesContainer = document.querySelector('.country');
const themeText = document.querySelector('.color-toggle__text');

(function () {
  const currentTheme = sessionStorage.getItem('theme') ? sessionStorage.getItem('theme') : null;
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    (currentTheme === 'light') ? themeText.textContent = 'Dark Mode' : themeText.textContent = 'Light Mode';
  }
})();

class Search {
  async getCountries() {
    const response = await fetch('https://restcountries.eu/rest/v2/all');
    const data = await response.json();
    return data;
  }
}

class Storage {
  setItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }
}

class UI {
  renderCountry(country) {
    const html =
      `<div class="card" data-country-id="${country.alpha3Code}">
        <a class="card__link">
          <img src="${country.flag}" alt="Country flag" class="card__img">
          <div class="card__body">
            <h1 class="card__header">${country.name}</h1>
            <p class="card__info">Population: <span class="card__span">${country.population}</span></p>
            <p class="card__info">Region: <span class="card__span">${country.region}</span></p>
            <p class="card__info">Capital: <span class="card__span">${country.capital}</span></p>
          </div>
        </a>
      </div>
      `
    countriesContainer.insertAdjacentHTML('beforeend', html);
  }

  clearContainer() {
    countriesContainer.innerHTML = '';
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const storage = new Storage();
  const search = new Search();
  const ui = new UI();

  const allCountries = await search.getCountries();
  storage.setItem('allCountries', allCountries);

  allCountries.forEach(country => {
    ui.renderCountry(country);
  })

  searchField.addEventListener('keyup', () => {
    ui.clearContainer();
    const searchedCountries = allCountries.filter(country => {
      return country.name.toLowerCase().includes(searchField.value.toLowerCase());
    })

    searchedCountries.forEach(country => {
      ui.renderCountry(country);
    })
  })

  regionSelect.addEventListener('change', (e) => {
    const region = e.target.value;
    ui.clearContainer();

    if (region !== '---') {
      const searchedRegion = allCountries.filter(country => {
        return country.region.toLowerCase() == region.toLowerCase();
      })
      searchedRegion.forEach(country => {
        ui.renderCountry(country);
      })
    } else {
      allCountries.forEach(country => {
        ui.renderCountry(country);
      })
    }
  })

  countriesContainer.addEventListener('click', function (e) {
    if (e.target.closest('.card')) {
      const id = e.target.closest('.card').dataset.countryId;
      const countryDetail = allCountries.filter(country => country.alpha3Code === id);

      storage.setItem('country', countryDetail);
      window.location = 'country.html';
    }
  })

  themeToggle.addEventListener('click', () => {
    const currentTheme = sessionStorage.getItem('theme');
    if (currentTheme) {
      if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark')
        sessionStorage.setItem('theme', 'dark');
        themeText.textContent = 'Light Mode';
      }
      if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light')
        sessionStorage.setItem('theme', 'light');
        themeText.textContent = 'Dark Mode';
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      sessionStorage.setItem('theme', 'dark');
      themeText.textContent = 'Light Mode';
    }
  })
});