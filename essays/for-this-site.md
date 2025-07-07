---
layout: essay
type: essay
title: "Things I've done for this site, and how I did them"
# All dates must be YYYY-MM-DD format!
date: 2025-07-06
last_updated: 
published: true
labels:
  - Web Development
---

This is sort of like a changelog for this site, but also just wanted to document how I did some of the things.  

## Profile Picture Animation

<div style="max-width: 50%; margin: 0 auto;">
    <video autoplay muted playsinline onended="this.pause();" preload="auto" style="width: 100%; height: auto;">
        <source src="../img/for-this-site/icloud_animation.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

I liked iOS's beautiful animation in the iCloud settings page, where icons of iCloud services revolves around your profile picture. I wanted to recreate that effect, but in the context of my portofolio where some important steps of my life revolve around my profile picture. Some vibe-coding with Codex later and I ended up with a good starting point not having to deal with jekyll's Liquid templating language. 

```html
\{\% for icon in site.data.profile_icons \%\}
<a href="{{ icon.url | default: '#' }}" class="profile-icon{% if icon.circle %} circle{% endif %}"
data-scale="{{ icon.scale }}"
style="--angle: {{ icon.angle }}; animation-delay: {{ icon.delay }}; --end-opacity: {{ icon.opacity | default: 1 }};{% if icon.circle %} --circle-color: {{ icon.circle }};{% endif %}">
<img src="{{ icon.src | prepend: site.baseurl }}" alt="{{ icon.alt }}">
</a>
\{\% endfor \%\}
```

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