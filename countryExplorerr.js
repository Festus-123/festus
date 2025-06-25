  // API URL
    const apiURL = 'https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population';

    let countriesData = [];
    let sortedAsc = true;

    const countriesContainer = document.getElementById('countries');
    const searchInput = document.getElementById('searchInput');
    const regionSelect = document.getElementById('regionSelect');
    const sortButton = document.getElementById('sortButton');

    // Fetch data from API
    async function fetchCountries() {
      try {
        const res = await fetch(apiURL);
        countriesData = await res.json();
        displayCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries data', error);
        countriesContainer.innerHTML = '<p>Error fetching data</p>';
      }
    }

    // Display countries as cards
    function displayCountries(countries) {
      if (countries.length === 0) {
        countriesContainer.innerHTML = '<p>No countries found.</p>';
        return;
      }
      countriesContainer.innerHTML = countries.map(country => {
        const name = country.name.common;
        const capital = country.capital ? country.capital[0] : 'N/A';
        const region = country.region || 'N/A';
        const population = country.population.toLocaleString();
        const flag = country.flags.png;

        return `
          <div class="card">
            <img class="flag" src="${flag}" alt="Flag of ${name}" />
            <div class="country-name">${name}</div>
            <div class="info"><strong>Capital:</strong> ${capital}</div>
            <div class="info"><strong>Region:</strong> ${region}</div>
            <div class="info population"><strong>Population:</strong> ${population}</div>
          </div>
        `;
      }).join('');
    }

    // Filter countries based on search input and region select
    function filterCountries() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedRegion = regionSelect.value;

      const filtered = countriesData.filter(country => {
        const name = country.name.common.toLowerCase();
        const region = country.region;

        const matchesName = name.includes(searchTerm);
        const matchesRegion = selectedRegion ? region === selectedRegion : true;

        return matchesName && matchesRegion;
      });

      displayCountries(filtered);
    }

    // Sort countries by population
    function sortCountries() {
      const sortedCountries = [...countriesData];
      sortedCountries.sort((a, b) => sortedAsc 
        ? a.population - b.population 
        : b.population - a.population
      );
      sortedAsc = !sortedAsc; // Toggle sorting direction
      displayCountries(sortedCountries);
    }

    // Event Listeners
    searchInput.addEventListener('input', filterCountries);
    regionSelect.addEventListener('change', filterCountries);
    sortButton.addEventListener('click', sortCountries);

    // Fetch data on page load
    fetchCountries();