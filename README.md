# High-Performance React Table Application

Hey there! Welcome to my React table application. I built this as a technical assessment to demonstrate how to handle large datasets efficiently in the browser. The challenge? Render 1000+ rows smoothly without breaking a sweat. The solution? Virtualization, smart state management, and a lot of attention to detail.

## What Does This Do?

This is a fully-featured data table that lets you work with thousands of character records. Think of it as a mini admin panel where you can:

- **Browse thousands of rows** without lag (thanks to virtualization)
- **Search instantly** by name or location
- **Filter by health status** (Healthy, Injured, Critical)
- **Sort by power level** with a simple click
- **Select rows** individually or all at once
- **Mark records as viewed/unviewed** to keep track of what you've checked

The whole thing is built with modern React patterns, fully typed with TypeScript, and tested with Jest. I've also included Storybook so you can explore the components in isolation.

## What You'll Need

Before we get started, make sure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

That's it! Everything else will be installed automatically.

## Getting It Running

Here's how to get this up and running on your machine:

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd Assignment-Dope-Security
npm install --legacy-peer-deps
```

> **Note**: We're using `--legacy-peer-deps` because Storybook and Vite 7 have some peer dependency conflicts. It's safe to use here.

### Step 2: Generate Mock Data

```bash
node generate-data.js
```

This creates a `db.json` file with 1000+ unique character entries. Each character has a name, location, health status, power level, and view status.

### Step 3: Start the Servers

You'll need two terminal windows:

**Terminal 1 - JSON Server:**
```bash
npm run server
```
This starts a mock REST API on `http://localhost:3000`

**Terminal 2 - Development Server:**
```bash
npm run dev
```
This starts the Vite dev server on `http://localhost:5173`

Now open your browser and head to `http://localhost:5173`. You should see the table loaded with data!

## Available Commands

Here's what you can run:

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build |
| `npm run server` | Starts the JSON Server (port 3000) |
| `npm test` | Runs all tests |
| `npm run test:watch` | Runs tests in watch mode (great for TDD) |
| `npm run storybook` | Opens Storybook (port 6006) |
| `npm run build-storybook` | Builds Storybook for deployment |
| `npm run lint` | Checks code quality with ESLint |

## How It's Organized

I've structured the code to be modular and easy to navigate:

```
src/
├── components/
│   ├── AutoSizer/          # Makes the table responsive
│   ├── Button/             # Reusable button component
│   ├── Checkbox/           # Custom checkbox
│   ├── HealthBadge/        # Color-coded health indicators
│   ├── LoadingSpinner/     # Loading state
│   ├── Row/                # Individual table row
│   ├── SearchBar/          # Search input
│   ├── Table/              # Main table component
│   │   ├── TableFilter/    # Health filter dropdown
│   │   └── __tests__/      # Integration tests
│   └── TableControls/      # View/unview buttons
├── hooks/
│   └── useCharacterData.ts # Custom hook for fetching data
├── store/
│   ├── index.ts            # Redux store setup
│   └── tableSlice.ts       # All table-related state logic
├── types/
│   └── index.ts            # TypeScript types
├── App.tsx                 # Root component
└── main.tsx                # Entry point
```

## How It Works

### The Big Picture

The app follows a standard Redux flow:

```
User clicks something → Component dispatches action → Reducer updates state → UI re-renders
```

All the table state (search query, filters, selected rows, etc.) lives in Redux. This makes it easy to track what's happening and keeps the components clean.

### Key Components

**Table Component**  
This is the heart of the app. It uses `react-window` to virtualize the list, which means it only renders the rows you can actually see. Even with 1000+ rows, you'll only have ~20-30 DOM elements at any time. That's why it's so fast.

**TableFilter Component**  
The health filter in the column header. You can select multiple health statuses at once, and it shows a badge with the count of active filters.

**TableControls Component**  
The buttons at the top that let you mark selected rows as viewed or unviewed. When you click them, it logs the selected IDs to the console (useful for debugging or integrating with an API).

**Row Component**  
Each individual row. It handles its own checkbox and displays the character data with a color-coded health badge.

## Testing

I've written integration tests to cover the main user flows:

```bash
npm test
```

The tests cover:
- Rendering data correctly
- Search functionality
- Health filtering
- Row selection (single and multi)
- Sorting by power
- Marking rows as viewed/unviewed

I'm using **Jest** with **React Testing Library** because it encourages testing from the user's perspective rather than implementation details.

## Storybook

Want to see the components in isolation? Run:

```bash
npm run storybook
```

Then visit `http://localhost:6006`. You'll find stories for most of the UI components, which is great for development and documentation.

## Features Breakdown

### Virtualization
Only visible rows are rendered. As you scroll, rows are recycled. This is what makes the table performant with large datasets.

### Search
Type in the search bar and the table filters instantly by name or location. No debouncing yet, but it's fast enough that you won't notice.

### Health Filter
Click the filter icon in the "Health" column header. You can select multiple statuses (Healthy, Injured, Critical) and the table updates immediately.

### Sorting
Click the "Power" column header to sort. Click again to reverse the order. Click a third time to remove sorting.

### Selection
- Click any checkbox to select that row
- Click the header checkbox to select all visible rows (respects current filters)
- Selected rows get a blue background

### View Status
Select some rows and click "Mark as Viewed" or "Mark as Unviewed". The selected IDs are logged to the console, and you'll see a checkmark appear next to viewed rows.

## Tech Stack

Here's what I used and why:

**Core**
- **React 19.2.0** - Latest version with improved performance
- **TypeScript 5.9.3** - Catch errors before runtime
- **Vite 7.2.4** - Lightning-fast dev server and builds

**State Management**
- **Redux Toolkit 2.11.1** - Makes Redux actually enjoyable to use
- **React Redux 9.2.0** - React bindings

**UI & Styling**
- **Tailwind CSS 3.4.17** - Utility-first CSS (no custom CSS files needed)
- **Lucide React** - Clean, consistent icons
- **classnames** - Conditional class names made easy

**Performance**
- **react-window 1.8.10** - The secret sauce for virtualization

**Development**
- **Storybook 8.6.14** - Component playground
- **Jest 30.2.0** - Testing framework
- **ESLint** - Code quality
- **json-server** - Mock API

## Performance Optimizations

Here's what makes this fast:

1. **Virtualization** - Only 20-30 rows in the DOM at any time, even with 1000+ total
2. **Memoization** - Components use `React.memo` to avoid unnecessary re-renders
3. **Efficient filtering** - Computed selectors prevent recalculating filtered data on every render
4. **Code splitting** - Vite automatically splits the bundle for faster initial loads

## Accessibility

I've tried to make this usable for everyone:

- Semantic HTML (`<table>`, `<th>`, `<td>`)
- ARIA labels on all interactive elements
- Keyboard navigation works throughout
- Screen reader friendly
- Good color contrast ratios
- Visible focus indicators

## Running Into Issues?

### Port Already in Use

If you see an error about port 3000 or 5173 being in use:

```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or just use a different port
json-server db.json --port 3001
```

### TypeScript Errors

Make sure all dependencies are installed:

```bash
npm install --legacy-peer-deps
```

### Tests Failing

Clear the Jest cache and try again:

```bash
npx jest --clearCache
npm test
```

### Storybook Won't Start

If you're seeing Vite version conflicts:

```bash
npm install --legacy-peer-deps
```

## Code Quality

I've followed these principles throughout:

- **Single Responsibility** - Each component does one thing well
- **DRY** - No repeated code
- **Consistent naming** - Easy to understand what things do
- **Proper typing** - TypeScript everywhere
- **Composition over inheritance** - React components compose naturally
- **Custom hooks** - Reusable logic extracted into hooks
- **Centralized state** - Redux keeps everything organized
- **Error handling** - Graceful failures with helpful messages

## What's Next?

If I had more time, here's what I'd add:

- Server-side pagination (for truly massive datasets)
- Advanced filtering (multiple columns at once)
- Export to CSV/Excel
- Column resizing and reordering
- Persistent state (save filters/sorting to localStorage)
- Dark mode
- Responsive mobile view
- Infinite scroll as an alternative to virtualization

## About This Project

This was built as a technical assessment to demonstrate proficiency in:
- Modern React development
- TypeScript
- State management with Redux
- Performance optimization
- Testing
- Clean code principles

Feel free to explore the code, run the tests, and play around with Storybook. If you have any questions or feedback, I'd love to hear them!

---
