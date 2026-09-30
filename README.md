# Ojasv Issar × WildEye

My application page for the **Software Engineer (TrapTagger)** role at [WildEye Conservation](https://wildeyeconservation.org).
It maps the job ad to my experience, shows the TrapTagger-shaped work I've done, and explains how a developer in
Vancouver (UTC−7, nine hours behind Johannesburg all year) extends a Johannesburg team's day.

**Live:** https://ojasvissar.github.io/TrapTagger/

Built with **React 19** and **Vite**, and deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml`.

## What's in it

- **Topographic backgrounds.** Each section generates its own terrain (seeded gaussian hills plus value noise),
  traces it into contour lines with `d3-contour`, and draws the lines in as the section scrolls into view. A second
  copy of the lines lights up around the cursor.
- **A trail down the margin** that runs through every numbered section and fills in as you scroll.
- **A camera-trap demo** in the hero, and an aerial survey frame whose elephants are boxed and counted as a scan
  line passes, echoing TrapTagger and SurveyScope.
- **A live day/night world map** (`d3-geo`, `world-atlas`) and a working-day planner showing the overlap between
  Vancouver and Johannesburg.

## Layout

```
src/
  content.jsx          all copy and data (checklist, projects, contacts, credits)
  App.jsx              section order
  components/          Hero, Checklist, Skills, Aerial, TimeZones, WorldMap, Closing (why, plan, contact, footer),
                       Topo (contour backgrounds), Trail, Nav, motion helpers, icons
  hooks/               useInView, a shared scroll/pointer loop, useNow
  lib/                 terrain + contours, time-zone maths, motion preferences
public/img/            photos and project figures (WebP)
```

## Run it

```sh
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Credits

Photos via Wikimedia Commons: camera-trap leopard by MSGNP (CC BY-SA 3.0), Okavango elephants by diego_cue
(CC BY-SA 3.0), leopard at night in Madikwe by flowcomm (CC BY 2.0), leopard in South Luangwa by I've Got It On Film!
(CC BY 2.0). Resized and compressed. Project figures are my own.
