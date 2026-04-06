# JF BrokerMap

Personal-use leasing dashboard built with React, Vite, Tailwind CSS, and Mapbox.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your Mapbox token:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set `VITE_MAPBOX_TOKEN`.

4. Start the app:

   ```bash
   npm run dev
   ```

## Notes

- Building data lives in [src/data/buildings.json](./src/data/buildings.json)
- Favorites, notes, and recent views are stored in `localStorage`
- Replace the sample building websites with your own official property URLs
