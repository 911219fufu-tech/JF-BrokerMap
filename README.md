# JF BrokerMap

Internal leasing map dashboard for personal use.

Live site:
`https://jf-broker-map.vercel.app/`

## What It Does

`JF BrokerMap` helps you:
- search buildings quickly
- filter by area
- see buildings on a map
- open official property websites fast
- save favorites
- keep personal notes
- track recent views

## Areas Currently Included

- `LIC`
- `Queens`
- `DTBK`
- `JSQ`
- `Harrison`
- `Union City`

## Local Use

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example file:

```bash
cp .env.example .env
```

3. Add your Mapbox public token:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

4. Start the app:

```bash
npm run dev
```

## How To Use The App

- Use the search bar to search by building name or area
- Use the filters to narrow by area, price, or apartment type
- Click a building card to center the map and open building details
- Click a map marker to highlight the building and open its details
- Use `Open Official Website` to jump to the property site
- Use `Copy Link` to copy the website URL
- Use the star button to save favorites
- Add your own leasing notes in the detail panel

## Notes

- Favorites, recent views, and notes are stored in `localStorage`
- Notes are personal and saved in your browser
- If a building has no website yet, the website button will be disabled

## Updating Building Data

Add or edit building info in:

```text
building-data-current.yaml
```

Then sync it into the app data with:

```bash
node scripts/sync-lic-data.mjs
```

That sync step also geocodes addresses into map coordinates.

## Vercel Deployment

If the deployed site shows `Mapbox Required`, your Vercel production env var is missing.

Add this in `Vercel > Project Settings > Environment Variables`:

```text
VITE_MAPBOX_TOKEN
```

Use a `Mapbox public token` that starts with `pk`, then redeploy.

Important:
- `Development` env vars alone do not fix the production site
- Vercel does not use your local `.env`
