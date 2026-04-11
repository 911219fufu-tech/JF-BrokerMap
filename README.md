# JF BrokerMap

A map-based leasing dashboard built to help rental agents organize buildings, pricing, availability links, OP notes, and personal follow-up notes in one place.

Live demo: [https://jf-broker-map.vercel.app/](https://jf-broker-map.vercel.app/)

## Overview

`JF BrokerMap` was built around a real workflow problem: rental building information is usually scattered across Google Maps, official property websites, availability pages, and personal notes.

This project turns that process into a single internal tool where an agent can quickly search buildings, compare inventory, open official links, and keep track of important leasing details.

## Features

- Interactive `Mapbox` map with building markers
- Search by building name or area
- Filter by area, price range, and apartment type
- Building detail panel with:
  - official website
  - availability link
  - pricing range
  - apartment types
  - OP / concession notes
  - fee information for selected buildings
- Favorites, recent views, and personal notes saved in `localStorage`
- Structured inventory data for more accurate price + type filtering

## Markets Included

- `LIC`
- `Queens`
- `DTBK`
- `DTJC`
- `JSQ`
- `Newport`
- `Harrison`
- `Union City`
- `Forten`
- `Midtown West`
- `Upper Manhattan`

## Tech Stack

- `React`
- `Vite`
- `Tailwind CSS`
- `Mapbox GL`
- `react-map-gl`

## Running Locally

Install dependencies:

```bash
npm install
```

Add a Mapbox token to `.env`:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

Start the app:

```bash
npm run dev
```

## Data Workflow

The editable source file is:

```text
building-data-current.yaml
```

To sync it into the app dataset:

```bash
node scripts/sync-lic-data.mjs
```

That script updates:

```text
src/data/buildings.json
```

## Why This Project Matters

This project shows:

- product thinking based on a real user workflow
- map-based UI design
- structured front-end data modeling
- responsive filtering and detail views
- practical state persistence with `localStorage`

It is not a mock apartment listing site. It is a working internal operations tool built for a specific leasing use case.
