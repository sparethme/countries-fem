const detailsContainer = document.querySelector('.detail');
const themeToggle = document.querySelector('.color-toggle');
const themeText = document.querySelector('.color-toggle__text');
const backButton = document.querySelector('.back-link');

backButton.addEventListener('click', () => {
  window.location = 'index.html'
});

(function () {
  const currentTheme = sessionStorage.getItem('theme') ? sessionStorage.getItem('theme') : null;
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    (currentTheme === 'light') ? themeText.textContent = 'Dark Mode' : themeText.textContent = 'Light Mode';
  }
})();

function getItem(key) {
  return JSON.parse(sessionStorage.getItem(key))
}

function renderDetail(country) {
  function findBorderName(str) {
    const allCountries = getItem('allCountries');
    const borderName = allCountries.filter(cur => cur.alpha3Code === str)[0].name;
    return borderName;
  }

  function renderBorders(borders) {
    let html = ''
    if (borders.length < 1) {
      return 'No border countries.';
    }
    borders.forEach(cur => {
      html += `
      <li class="b-country__item">${findBorderName(cur)}</li>
      `
    })
    return html;
  }

  function renderList(list) {
    return list.map(item => item.name).join(', ');
  }

  const html = `
    <img src="${country.flag}" alt="Country flag" class="detail__img">
    <div class="detail__body">
      <h1 class="detail__header">${country.name}</h1>

      <ul class="detail__list">
        <li class="detail__info">Native Name: <span class="detail__span">${country.nativeName}</span></li>
        <li class="detail__info">Population: <span class="detail__span">${country.population}</span></li>
        <li class="detail__info">Region: <span class="detail__span">${country.region}</span></li>
        <li class="detail__info">Sub Region: <span class="detail__span">${country.subregion}</span></li>
        <li class="detail__info">Capital: <span class="detail__span">${country.capital}</span></li>
      </ul>
      <ul class="detail__list">
        <li class="detail__info">Top Level Domain: <span class="detail__span">${country.topLevelDomain}</span></li>
        <li class="detail__info">Currencies: <span class="detail__span">${renderList(country.currencies)}</span></li>
        <li class="detail__info">Languages: <span class="detail__span">${renderList(country.languages)}</span></li>
      </ul>
    <div/>
    <div class="b-country">
      <h3 class="b-country__header">Border Countries:</h3>
      <ul class="b-country__list">
        ${renderBorders(country.borders)}
      </ul>
    </div>
  `
  detailsContainer.insertAdjacentHTML('beforeend', html)
}

document.addEventListener('DOMContentLoaded', () => {
  const countryData = getItem('country');

  renderDetail(countryData[0]);

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