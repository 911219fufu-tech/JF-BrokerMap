# JF BrokerMap

A broker workspace for leasing teams to manage building inventory, private client requirements, and roommate matching in one place.

Live demo: [https://jf-broker-map.vercel.app/](https://jf-broker-map.vercel.app/)

## Overview

`JF BrokerMap` was built around a real workflow problem: rental building information is usually scattered across Google Maps, official property websites, availability pages, and personal notes.

This project turns that process into a single internal tool where a broker can:

- search and compare buildings from a map-driven dashboard
- save favorites, notes, and recent views locally for building research
- sign in to a private client workspace backed by `Supabase`
- store client requirements in the cloud with per-broker isolation
- generate roommate suggestions from budget, area, move-in timing, layout, occupancy, and living-room-sharing preferences

## Features

- `Portfolio` page
  - interactive `Mapbox` map with building markers
  - search by building name or area
  - filter by area, price range, apartment type, and OP priority
  - building detail panel with official links, pricing, apartment types, notes, and fee context
  - favorites, recent views, and building notes saved in `localStorage`
- `Clients` page
  - `signup`, `login`, and `logout` through `Supabase Auth`
  - private client records scoped to the logged-in broker
  - structured fields for budget, target areas, move-in date, living setup, occupancy, gender preference, lifestyle, pets, smoking, must-haves, and notes
  - support for `Any suitable layout`, `Studio`, `1 Bedroom`, `2 Bedroom`, and `3 Bedroom+`
  - living-room preference fields:
    - can the client sleep in the living room
    - can the client accept someone else sleeping in the living room
  - roommate matching that excludes solo/studio setups and ranks compatible leads
- `Supabase` data isolation
  - every client row belongs to one authenticated broker via `user_id`
  - `Row Level Security` policies restrict read/write access to the owner only

## Markets Included

- `LIC`
- `Queens`
- `Midtown`
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
- `Supabase Auth`
- `Supabase Postgres`

## Running Locally

Install dependencies:

```bash
npm install
```

Add your environment variables to `.env`:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_public_token
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-project-anon-key
```

Start the app:

```bash
npm run dev
```

## Supabase Setup

This app now expects:

- `Supabase Auth` for `signup`, `login`, and `logout`
- a `clients` table protected by `Row Level Security`

Run the SQL in [supabase/clients.sql](/Users/fujiayin/Desktop/仲介/Broker%20Website/supabase/clients.sql) inside the Supabase SQL editor.

Recommended setup steps:

1. Create a `Supabase` project.
2. Copy `Project URL` and `anon` or `publishable` key into `.env`.
3. Run [supabase/clients.sql](/Users/fujiayin/Desktop/仲介/Broker%20Website/supabase/clients.sql) in the `SQL Editor`.
4. In `Authentication > Providers`, enable `Email`.
5. In `Authentication > URL Configuration`, add your local and deployed app URLs.
6. Restart `npm run dev` after editing `.env`.

Each client row is tied to `auth.users.id` through `user_id`, and the RLS policies ensure authenticated brokers can only select, insert, update, and delete their own rows.

If you already created the `clients` table from an older schema, re-run [supabase/clients.sql](/Users/fujiayin/Desktop/仲介/Broker%20Website/supabase/clients.sql) to add newer columns such as:

- `living_setup`
- `max_occupants`
- `accepts_living_room_for_self`
- `accepts_living_room_occupant`

Without those columns, client creation will fail because the front end now writes those fields.

## Client Matching Rules

Roommate suggestions are based on a mix of hard filters and soft scoring.

Hard filters:

- both leads must be eligible for sharing
- `Studio` and `solo_only` setups are excluded
- target areas must overlap
- move-in dates cannot be too far apart
- gender preferences must be compatible
- smoking and pet conflicts are excluded
- occupancy and living-room preferences must not conflict

Soft scoring:

- closer budget overlap
- stronger move-in overlap
- shared areas
- matching layout expectations
- similar lifestyle and schedule
- shared must-have amenities
- compatible living-room flexibility when extra occupancy is needed

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
- structured front-end and database modeling
- authenticated multi-user workflow design
- row-level access control for private client data
- responsive filtering and detail views
- mixed persistence strategy:
  - `localStorage` for personal building notes, favorites, and recent views
  - `Supabase` for authenticated client records

It is not a mock apartment listing site. It is a working internal operations tool built for a specific leasing use case.
