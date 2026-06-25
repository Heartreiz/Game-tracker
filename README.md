# Game Backlog

Static GitHub Pages game tracker.

## Main files

- `index.html`: page structure
- `style.css`: visual theme
- `script.js`: search, filters, and card rendering
- `games.json`: editable game data
- `covers/`: game cover images

## Filtering

The page supports:

- title search
- series filter
- system filter
- tag filter
- label filter

## Example game entry

```json
{
  "title": "Example Game",
  "series": "Example Series",
  "play_order": 1,
  "systems": ["PC", "Nintendo Switch"],
  "status": "Backlog",
  "priority": "High",
  "genre": "JRPG",
  "tags": ["JRPG", "Turn-based", "Long game"],
  "labels": ["Backlog", "Owned"],
  "cover": "covers/example-game.jpg",
  "notes": "Optional notes."
}
```

## Notes

- `tags` are flexible descriptors like `JRPG`, `Turn-based`, `Remake`, `Cozy`, `Short game`.
- `labels` are personal workflow states like `Owned`, `Wishlist`, `Playing`, `Paused`, `Finished`.
- Cover image paths are case-sensitive. Example: `covers/trails-from-zero.jpg`.
