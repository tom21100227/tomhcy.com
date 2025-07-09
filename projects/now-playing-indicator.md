---
layout: project
type: project
image: img/now-playing-indicator/now-playing-api-dashboard_compressed.png
title: "Now Playing API"
date: 2025
published: true
labels:
  - TypeScript
  - Web Development
  - Cloud Services
  - Cloudflare Workers
  - Music
summary: "A serverless API that fetches my currently playing song from Spotify and Apple Music, deployed with Cloudflare Workers."
# projecturl: "https://github.com/tom21100227/now-playing-api"
---

This project is on GitHub: [tom21100227/now-playing-api](https://github.com/tom21100227/now-playing-api)

[See it in action on this website.](https://tomhcy.com/)

This project started with a simple idea: to show what music I am currently listening to on this website. Inspired by [mdrxy.com](https://mdrxy.com), they used last.fm's public API, however I am not a last.fm user, so I wanted to use my own music data from Spotify and Apple Music without giving permission to any third party.

This is a simple API using Cloudflare Workers that fetches the currently playing song from my Spotify account and Apple Music, with logics and caching to determine which one is played more recent, and serves it to the website. It always feels nice knowing my data is only flowing through my code. 

- Use of smart KV cache to reduce API calls and improve performance.
- Use logs and logic to determine which music service is currently playing, bypass Apple Music's privacy restrictions.
- Adaptive TOL (Time of Life) for cache determined by song duration to ensure responsiveness.
- Well documentation for other people to adapt and use the API.

## How the API logic works: 

<div class="col-12 col-lg-10 mx-auto my-3">
  <img src="/img/now-playing-indicator/api-workflow.png" alt="Now Playing API Logic" class="img-fluid rounded">
</div>