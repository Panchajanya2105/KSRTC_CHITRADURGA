# KSRTC Chitradurga Portal

## About / Description
An unofficial, offline-capable progressive web application providing live departure boards, complete timetables, and route information for the KSRTC Chitradurga Division. Built with performance and accessibility in mind, this portal helps commuters across Chitradurga, Challakere, Hiriyuru, Holalkere, Bharamasagara, and Hosadurga find their next bus easily.

*Note: This is not an official KSRTC portal. Data is based on public schedules provided by ksrtc.karnataka.gov.in.*

## Built With (Tech Stack)
* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS** (with `autoprefixer` and `postcss`)
* **Lucide React** (for modern, scalable iconography)
* **clsx & tailwind-merge** (for dynamic utility class composition)

## Features
* **Live Departure Board:** Real-time countdowns for upcoming buses departing within the next 15 minutes and beyond.
* **Instant Offline Data Caching:** Advanced `localStorage` stale-while-revalidate caching ensures the portal loads instantly (0-second render) and works seamlessly in rural bus stands with poor connectivity.
* **Timetable Search & Autocomplete:** Smart search feature optimized to filter routes based exclusively on destination (with dynamic character highlighting).
* **Saved Favorite Buses:** Bookmark daily commuting buses for quick offline access and next-departure reminders.
* **Multi-Station Support:** Easily switch between different stands (Chitradurga, Challakere, Hiriyuru, etc.) to view localized schedules.
* **Passenger Feedback System:** Integrated modal allowing commuters to provide details regarding the time table changes and New bus details
* **Accessibility Features:** Built-in tools for font size adjustments, 12h/24h time format toggling, dark/light mode themes, and multi-language support.
* **Export & Native Visual Sharing:** Download filtered search results as PDFs, or generate beautiful, shareable image cards of specific bus routes using native OS share sheets (`navigator.share`).
* **Responsive Design:** Optimized layout with dynamic view routing (`Home`, `Timetable`, `Stations`, `About`) for mobile and desktop screens.

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm (or yarn/pnpm)

### Installation
1. Clone the repository and navigate into the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (optimized for the Antigravity IDE emulator):
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:5173`.

### Build for Production
To create a production-ready optimized build:
```bash
npm run build
```
To preview the built production app:
```bash
npm run preview
```

## Project Structure
```text
.
├── public/                 # Static assets and JSON schedule data (e.g., challakere.json)
├── src/
│   ├── components/         # Reusable UI components (Header, Toast, AnnouncementBar)
│   │   └── Views/          # Main application screens (HomeView, TimetableView, etc.)
│   ├── hooks/              # Custom React hooks (useTheme, useLanguage, useBusData, etc.)
│   ├── types/              # TypeScript definitions and interfaces
│   ├── utils/              # Helper functions (time calculation, PDF export, constants)
│   ├── App.tsx             # Root application component and view router
│   └── main.tsx            # React application entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Roadmap / Future Improvements
* Full PWA Service Worker integration for asset caching and background sync.
* Add predictive routing and delay estimation based on crowd-sourced passenger feedback.
* Enhance autocomplete highlighting logic for multi-character sub-string matches.

## Acknowledgments
* Data referenced from the official [KSRTC Karnataka Website](https://ksrtc.karnataka.gov.in/).
