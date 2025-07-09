---
layout: essay
type: essay
title: "Things I've done for this site, and how I did them"
date: 2025-07-06
last_updated: 2025-07-08
published: true
labels:
  - Web Development
  - HTML
  - CSS
  - JavaScript
  - Jekyll
  - Bootstrap
---

This is sort of like a changelog for this site, but also just wanted to document how I did some of the things.  

## Now Playing Indicator

I wanted to show some personality with what kind of music I am listening to, so I added a "Now Playing" indicator to the top of the page. I built my personal music API endpoint with Cloudflare Workers which fetches the current playing song from my Spotify account. Thankfully with [HealthViz](/projects/healthviz.html) I already have an Apple Developer account to use MusicKit for Apple Music. 

This has evolved into a distinct project for me, so check it out about it in my [Now Playing API project](/projects/now-playing-indicator.html).

### How it works

Spotify is quite straightforward, it tells you if the user is currently listening to something, and if so, it returns the currently playing song. If not, it returns an empty response. However, Apple Music is quite privacy sensitive, and it only tells you what the user recently listened to. There's no clue on whether the user is currently listening to something or not. So I had to implement some logic to determine if the user is currently listening to something.

<div class="col-12 col-lg-8 mx-auto my-3">
  <img src="/img/now-playing-indicator/api-workflow.png" alt="Now Playing API Logic" class="img-fluid rounded">
</div>

In the front end, some minimal JS is used to fetch the API endpoint and display the currently playing song. It also handles the case where the user is not currently listening to anything, and displays a default message instead. Thanks to my addition of profile picture animation, I can also display the currently playing song's album cover as an icon around my profile picture. I purposefully made it so that the album cover appears after a 0.5 second delay, to give my worker enough time to respond and fetch the currently playing song. 


## Profile Picture Animation

<div class="col-12 col-lg-8 mx-auto my-1">
  <div class="ratio ratio-16x9" style="max-height: 50vh;">
    <video class="rounded" autoplay muted playsinline onended="this.pause();" preload="auto" style="object-fit: contain;">
      <source src="../img/for-this-site/icloud_animation.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</div>

I liked iOS's beautiful animation in the iCloud settings page, where icons of iCloud services revolves around your profile picture. I wanted to recreate that effect, but in the context of my portofolio where some important steps of my life revolve around my profile picture. Some vibe-coding with Codex later and I ended up with a good starting point not having to deal with jekyll's Liquid templating language. 

{% raw %}
```html
{% for icon in site.data.profile_icons %}
<a href="{{ icon.url | default: '#' }}" class="profile-icon{% if icon.circle %} circle{% endif %}"
data-scale="{{ icon.scale }}"
style="--angle: {{ icon.angle }}; animation-delay: {{ icon.delay }}; --end-opacity: {{ icon.opacity | default: 1 }};{% if icon.circle %} --circle-color: {{ icon.circle }};{% endif %}">
    <img src="{{ icon.src | prepend: site.baseurl }}" alt="{{ icon.alt }}">
</a>
{% endfor %}
```
{% endraw %}

Not the biggest JavaScript fan here, so I opted for a CSS solution on the animation part. With a bit of CSS magic, and tweaking the animation speed function and position, I was able to achieve a similar effect.

```css
.profile-wrapper.loaded .profile-icon {
  animation: orbit-in 0.5s forwards cubic-bezier(0.68, -0.3, 0.32, 1.3);
}

@keyframes orbit-in {
  from {
    opacity: 0;
    transform: 
      translate(-50%, -50%) 
      rotate(45deg) 
      translate(calc(var(--radius) * 0.3))
      scale(0.01);
  }
  to {
    opacity: var(--end-opacity, 1);
    transform: 
      translate(-50%, -50%) 
      rotate(var(--angle)) 
      translate(calc(var(--radius) * 0.95)) 
      rotate(calc(-1 * var(--angle)))
      scale(var(--end-scale, 1));
  }
}
```

## Dark Mode

I mean, what is a website in 2025 without darkmode? This was quite easy, with a few lines of CSS using the `@media (prefers-color-scheme: dark)` media query. I got it to work. It's not the best solution yet, as in some of the CSS I committed some sins with overwriting bootstrap variables, but it works for now. I will probably revisit this in the future. Maybe I just need to learn more jekyll and Liquid to make it more dynamic.

```css
@media (prefers-color-scheme: dark) {
    ...

  .navbar-light .navbar-nav .nav-link:hover,
  .navbar-light .navbar-brand:hover {
    color: #fff;
  }
    ...
}
```

## Misc features

### Project Page Logic

Some of my projects are long-term projects, spanning multiple years. I wanted to be able to sort them by the year they started, and also show the current year if it's still ongoing. I added a `start_date` property to my project data so that I can display the year they started. To make sure this does not break existing projects that lasted less than a year, `date` is still used and is used to sort the projects, with `start_date` being a tie breaker. 

{% raw %}
```yml
---
layout: project
type: project
image: img/honorthesis/FinalPoster.png
title: "Year Long Project"
startDate: 2022
date: 2025
published: true
labels:
  ...
summary: "A very very long project that spans multiple years."
---
```
{% endraw %}

Would render as `2022 - 2025` in the project page. If the project is still ongoing, it would render as `2022 - Present`. The sorting algorithm is configured to always prefer projects that have `date` as `present` being displayed first. 

### Last Updated for Writings

For writings/essays that receive updates, I added a `last_updated` property to my essay's yml metadata, and updated the essay layout to display it if it exists.

{% raw %}
```yml
---
layout: essay
type: essay
title: "title"
date: 2025-07-06
last_updated: 2025-07-10
published: true
labels:
  ...
---
```
{% endraw %}

Would render as `Updated: 10 Jul 2025`. 
