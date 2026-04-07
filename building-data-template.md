# JF BrokerMap Building Data Template

Use one block per building.
If a field is unknown, leave it blank or write `TBD`.
Do not collect Google ratings/review counts.

```yaml
- name:
  area:
  address:
  borough_or_city:
  zipcode:
  lat:
  lng:
  price:
  type:
  op:
  website:
  emails:
  phones:
  flags:
  notes:
```

## Field Guide

- `name`: building name
- `area`: one of `LIC`, `Queens`, `DTBK`, `JSQ`, `West NY`
- `address`: street address if known
- `borough_or_city`: example `Long Island City`, `Brooklyn`, `Jersey City`
- `zipcode`: optional
- `lat`: exact latitude if you have it
- `lng`: exact longitude if you have it
- `price`: examples `2800-3500`, `3200+`, `Ask`
- `type`: list like `Studio, 1B, 2B`
- `op`: examples `0 OP`, `1 OP`, `OP on Net Figure`
- `website`: official property website
- `emails`: comma-separated
- `phones`: comma-separated
- `flags`: short tags like `No 2B`, `Guarantors accepted`, `Condo`
- `notes`: freeform internal notes

## Multi-Building Example

```yaml
- name: ARC Luxury Long Island City Apartments
  area: LIC
  address: 30-02 39th Ave, Long Island City, NY 11101
  borough_or_city: Long Island City
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: https://arclivinglic.com/
  emails: leasing@arclivinglic.com, harold@arclivinglic.com
  phones: +19299306154
  flags:
  notes:

- name: Sven Luxury Apartment Rentals LIC
  area: LIC
  address: 29-59 Northern Blvd, Long Island City, NY 11101
  borough_or_city: Long Island City
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: https://www.svenlic.com/?utm_source=google&utm_medium=organic&utm_campaign=gmb
  emails: 
  phones: +17185502494
  flags:
  notes:

- name: ALTA+
  area: LIC
  address: 29-22 Northern Blvd, Queens, NY 11101
  borough_or_city: Long Island City
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: https://altalic.com/
  emails: 
  phones: +17186062922
  flags:
  notes:

- name: Packard Square
  area: LIC
  address: 41-34 Crescent St, Astoria, NY 11101
  borough_or_city: 
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: http://www.packardsquare.com/
  emails: 
  phones: +17183920325
  flags:
  notes:


- name: Jackson Park LIC
  area: LIC
  address: 28-16 Jackson Ave, Long Island City, NY 11101
  borough_or_city: Long Island City
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: https://jacksonparklic.com/?utm_source=google&utm_medium=Yext
  emails: 
  phones: +17185225766
  flags:
  notes:
- name: 
  area: LIC
  address: 
  borough_or_city: Long Island City
  zipcode: 
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: 
  emails: 
  phones: 
  flags:
  notes:
- name: 
  area: LIC
  address: 
  borough_or_city: Long Island City
  zipcode: 
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: 
  emails: 
  phones: 
  flags:
  notes:
- name: 
  area: LIC
  address: 
  borough_or_city: Long Island City
  zipcode: 
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: 
  emails: 
  phones: 
  flags:
  notes:


name: 
  area: LIC
  address: 
  borough_or_city: Long Island City
  zipcode: 
  lat:
  lng:
  price: Ask
  type:
  op: 0 OP
  website: 
  emails: 
  phones: 
  flags:
  notes:



- name: Gotham Point
  area: LIC
  address:
  borough_or_city: Long Island City
  zipcode:
  lat:
  lng:
  price: Ask
  type:
  op:
  website:
  emails: Leasing@GothamPoint.com
  phones:
  flags:
  notes:
```
