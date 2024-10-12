let heroes = [];
let currentPage = 1;
let pageSize = 20;
let searchQuery = "";

const loadData = (data) => {
  heroes = data;
  renderTable();
};

const renderTable = () => {
  const tbody = document.getElementById("heroes-body");
  tbody.innerHTML = "";

  const totalHeroes = pageSize === "all" ? heroes.length : pageSize;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + totalHeroes, heroes.length);

  for (let i = startIndex; i < endIndex; i++) {
    const hero = heroes[i];
    const row = document.createElement("tr");

    row.innerHTML = `
              <td><img src="${hero.images.xs}" alt="${
      hero.name
    }" style="width: 40px;"></td>
  <td>${hero.name}</td>
  <td>${hero.biography.fullName}</td>
  <td>${JSON.stringify(hero.powerstats)}</td>
  <td>${hero.appearance.race}</td>
  <td>${hero.appearance.gender}</td>
  <td>${hero.appearance.height.join(", ")}</td>
  <td>${hero.appearance.weight.join(", ")}</td>
  <td>${hero.biography.placeOfBirth}</td>
  <td>${hero.biography.alignment}</td>
  `;
    tbody.appendChild(row);
  }
};

const updatePageSize = () => {
  pageSize = document.getElementById("pageSize").value;
  if (pageSize === "all") {
    pageSize = heroes.length;
  }
  currentPage = 1;
  renderTable();
};
const nextPage = () => {
  const totalPages = Math.ceil(heroes.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
};

const handleSearch = () => {
  searchQuery = document.getElementById("search").value;
  const suggestions = include(searchQuery);
  renderSearch(suggestions);
};

const include = (searchQuery) => {
  return heroes.filter((hero) =>
    hero.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const renderSearch = (filteredHeroes = heroes) => {
  const tbody = document.getElementById("heroes-body");
  tbody.innerHTML = "";

  let totalHeroes;

  if (pageSize === "all") {
    totalHeroes = filteredHeroes.length;
    currentPage = 1;
  } else {
    totalHeroes = Math.min(pageSize, filteredHeroes.length);
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex =
    pageSize === "all" ? filteredHeroes.length : startIndex + totalHeroes;

  for (let i = startIndex; i < endIndex && i < filteredHeroes.length; i++) {
    const hero = filteredHeroes[i];
    const row = document.createElement("tr");

    row.innerHTML = `
          <td><img src="${hero.images.xs}" alt="${
      hero.name
    }" style="width: 40px;"></td>
          <td>${hero.name}</td>
          <td>${hero.biography["full-name"]}</td>
          <td>${JSON.stringify(hero.powerstats)}</td>
          <td>${hero.appearance.race}</td>
          <td>${hero.appearance.gender}</td>
          <td>${hero.appearance.height.join(", ")}</td>
          <td>${hero.appearance.weight.join(", ")}</td>
          <td>${hero.biography["place-of-birth"]}</td>
          <td>${hero.biography.alignment}</td>
      `;
    tbody.appendChild(row);
  }

  document.getElementById("prev").style.display =
    currentPage > 1 ? "inline" : "none";
  document.getElementById("next").style.display =
    pageSize !== "all" &&
    currentPage < Math.ceil(filteredHeroes.length / pageSize)
      ? "inline"
      : "none";
};

document.getElementById("search").addEventListener("input", handleSearch);
document.getElementById("pageSize").addEventListener("change", updatePageSize);
document.getElementById("next").addEventListener("click", nextPage);
document.getElementById("prev").addEventListener("click", prevPage);

fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(loadData)
  .catch((error) =>
    console.error("There was a problem with the fetch operation:", error)
  );
