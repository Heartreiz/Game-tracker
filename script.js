let games = [];

const els = {
  grid: document.getElementById('cardGrid'),
  template: document.getElementById('gameCardTemplate'),
  search: document.getElementById('searchInput'),
  series: document.getElementById('seriesFilter'),
  system: document.getElementById('systemFilter'),
  arc: document.getElementById('arcFilter'),
  status: document.getElementById('statusFilter'),
  reset: document.getElementById('resetButton'),
  count: document.getElementById('resultCount')
};

fetch('games.json')
  .then(response => response.json())
  .then(data => {
    games = data.sort((a, b) => a.play_order - b.play_order);
    buildFilters();
    render();
  })
  .catch(error => {
    els.grid.innerHTML = `<p>Could not load games.json. If opening locally, use a simple local server or GitHub Pages.</p>`;
    console.error(error);
  });

function uniqueValues(field) {
  return [...new Set(games.flatMap(game => Array.isArray(game[field]) ? game[field] : [game[field]]).filter(Boolean))].sort();
}

function populateSelect(select, values) {
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function buildFilters() {
  populateSelect(els.series, uniqueValues('series'));
  populateSelect(els.system, uniqueValues('systems'));
  populateSelect(els.arc, uniqueValues('arc'));
  populateSelect(els.status, uniqueValues('status'));
}

function matchesFilters(game) {
  const query = els.search.value.trim().toLowerCase();
  const selectedSeries = els.series.value;
  const selectedSystem = els.system.value;
  const selectedArc = els.arc.value;
  const selectedStatus = els.status.value;

  const matchesTitle = !query || game.title.toLowerCase().includes(query);
  const matchesSeries = !selectedSeries || game.series === selectedSeries;
  const matchesSystem = !selectedSystem || game.systems.includes(selectedSystem);
  const matchesArc = !selectedArc || game.arc === selectedArc;
  const matchesStatus = !selectedStatus || game.status === selectedStatus;

  return matchesTitle && matchesSeries && matchesSystem && matchesArc && matchesStatus;
}

function render() {
  const visibleGames = games.filter(matchesFilters);
  els.grid.innerHTML = '';
  els.count.textContent = `${visibleGames.length} game${visibleGames.length === 1 ? '' : 's'}`;

  visibleGames.forEach(game => {
    const node = els.template.content.cloneNode(true);
    const img = node.querySelector('.cover');
    const fallback = node.querySelector('.cover-fallback');

    img.src = game.cover || '';
    img.alt = `${game.title} cover`;
    img.onerror = () => img.classList.add('is-missing');
    if (!game.cover) img.classList.add('is-missing');
    fallback.textContent = game.title;

    node.querySelector('.play-order').textContent = `#${game.play_order}`;
    node.querySelector('.title').textContent = game.title;
    node.querySelector('.arc').textContent = `${game.series} · ${game.arc} · ${game.genre || 'Game'}`;
    node.querySelector('.status').textContent = game.status;
    node.querySelector('.priority').textContent = `${game.priority} Priority`;
    node.querySelector('.notes').textContent = game.notes || '';

    const systems = node.querySelector('.systems');
    game.systems.forEach(system => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = system;
      systems.appendChild(chip);
    });

    els.grid.appendChild(node);
  });
}

[els.search, els.series, els.system, els.arc, els.status].forEach(input => {
  input.addEventListener('input', render);
});

els.reset.addEventListener('click', () => {
  els.search.value = '';
  els.series.value = '';
  els.system.value = '';
  els.arc.value = '';
  els.status.value = '';
  render();
});
