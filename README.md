# Project: IES26

## Project Structure

```
fr/
├── src/
│   ├── components/     # Nunjucks components (hero, integrations, featured-work, etc.)
│   ├── layouts/        # Layout (layout.njk)
│   ├── pages/          # Pages (index.njk)
│   ├── styles/         # SASS/SCSS files
│   └── scripts/        # JS files (all modules imported in main.js)
├── public/             # Compiled code (HTML, CSS, JS)
```

## Install

- `npm install` - install all dependencies

## Build and Run

- `npm run dev` or `npm start` — start dev server with hot reload (http://localhost:3000), no minification for CSS and JS
- `npm run build` — production build to public folder (minified)
- `npm run clean` - clean public folder

## How Components Work

- Each major block is a separate file in `src/components/` (e.g., `header.njk`, `hero.njk`, etc.)
- Main page (`src/pages/index.njk`) assembles them via `{% include %}`.
- To change the order of blocks, simply change the include order in `index.njk`.
