# Revenue Aggregator

This is my solution for the React revenue aggregator coding task. The app loads product data from three branch JSON files, merges matching products, calculates total revenue per product, and displays the result in a searchable table.

## Features

- Fetches data from `api/branch1.json`, `api/branch2.json`, and `api/branch3.json`
- Loads all branch data together
- Merges products sold by multiple branches
- Calculates product revenue using `unitPrice * sold`
- Sorts products alphabetically by product name
- Filters products by name with a case-insensitive search
- Updates the displayed total revenue when the filter changes
- Formats all revenue values through a `formatNumber` helper
- Keeps the table header and total footer visible while only the table rows scroll

## Running The App

```bash
npm install
npm start
```

The app runs at:

```text
http://localhost:3000/
```

## Testing

```bash
npm test
```

The starter project did not include a unit test framework, and the task asked not to add external npm libraries. To keep the solution within the brief, I kept the dependency list unchanged and made `npm test` run the available project checks:

- ESLint
- Production build

I also manually verified the main functional requirements:

- All three branch files are fetched from the required API paths
- Duplicate product names are merged into one row
- Revenue is summed correctly across branches
- Product rows are sorted alphabetically
- Search is case-insensitive
- The total updates based on the filtered rows

## Implementation Notes

I kept the solution intentionally small and focused on the assessment requirements. I avoided adding pagination because the task says the table should show the displayed filtered products and total revenue. Pagination could make the meaning of the total less clear and may conflict with hidden assessment expectations.

The task mentions using the provided `formatNumber` function. I checked the starter files and there was no separate helper file included in this project, so I defined a local `formatNumber` helper and used it consistently for every displayed revenue value.

I also added a light Wowcher-inspired visual treatment with a magenta accent, summary panel, table hover states, and a bold total footer, without adding unnecessary UI complexity.
