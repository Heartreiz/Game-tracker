let games = [];

const els = {
  grid: document.getElementById('cardGrid'),
  template: document.getElementById('gameCardTemplate'),
  search: document.getElementById('searchInput'),
  series: document.getElementById('seriesFilter'),
  system: document.getElementById('systemFilter'),
  tag: document.getElementById('tagFilter'),
  label: document.getElementById('labelFilter'),
  reset: document.getElementById('resetButton'),
  count: document.getElementById('resultCount')
};

fetch('games.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`games.json returned ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    games = data.sort((a, b) => (a.play_order || 9999) - (b.play_order || 9999));
    buildFilters();
    render();
  })
  .catch(error => {
    els.count.textContent = '0 games';
    els.grid.innerHTML = `<p class="error">Could not load games.json. Check that games.json is valid JSON and is in the repo root.</p>`;
    console.error(error);
  });

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function uniqueValues(field) {
  return [...new Set(games.flatMap(game => asArray(game[field])).filter(Boolean))].sort();
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
  populateSelect(els.tag, uniqueValues('tags'));
  populateSelect(els.label, uniqueValues('labels'));
}

function matchesFilters(game) {
  const titleQuery = els.search.value.trim().toLowerCase();
  const selectedSeries = els.series.value;
  const selectedSystem = els.system.value;
  const selectedTag = els.tag.value;
  const selectedLabel = els.label.value;

  const matchesTitle = !titleQuery || (game.title || '').toLowerCase().includes(titleQuery);
  const matchesSeries = !selectedSeries || game.series === selectedSeries;
  const matchesSystem = !selectedSystem || asArray(game.systems).includes(selectedSystem);
  const matchesTag = !selectedTag || asArray(game.tags).includes(selectedTag);
  const matchesLabel = !selectedLabel || asArray(game.labels).includes(selectedLabel);

  return matchesTitle && matchesSeries && matchesSystem && matchesTag && matchesLabel;
}

function addChips(container, values, className = 'chip') {
  container.innerHTML = '';
  values.forEach(value => {
    const chip = document.createElement('span');
    chip.className = className;
    chip.textContent = value;
    container.appendChild(chip);
  });
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
    fallback.textContent = game.title || 'No cover';

    node.querySelector('.play-order').textContent = game.play_order ? `#${game.play_order}` : '';
    node.querySelector('.title').textContent = game.title || 'Untitled game';
    node.querySelector('.series').textContent = `${game.series || 'No series'} - ${game.genre || 'Game'}`;
    node.querySelector('.status').textContent = game.status || 'No status';
    node.querySelector('.priority').textContent = game.priority ? `${game.priority} Priority` : 'No priority';
    node.querySelector('.notes').textContent = game.notes || '';

    addChips(node.querySelector('.systems'), asArray(game.systems));
    addChips(node.querySelector('.tags'), asArray(game.tags), 'chip tag-chip');
    addChips(node.querySelector('.labels'), asArray(game.labels), 'chip label-chip');

    els.grid.appendChild(node);
  });
}

[els.search, els.series, els.system, els.tag, els.label].forEach(input => {
  input.addEventListener('input', render);
});

els.reset.addEventListener('click', () => {
  els.search.value = '';
  els.series.value = '';
  els.system.value = '';
  els.tag.value = '';
  els.label.value = '';
  render();
});
