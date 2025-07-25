# [tomhcy.com](https://tomhcy.com)

Based on [TechFolios](https://techfolios.github.io).

[<img width="1300" height="902" alt="demo" src="https://github.com/user-attachments/assets/0a8b22fa-6cd8-4217-9ef6-386aaa29e88f" />](https://tomhcy.com)


<p align="center">
<img width="449" height="105" alt="Lighthouse Result" src="https://github.com/user-attachments/assets/25ec67b6-af36-4310-b22f-68636711d68f"/>
</p>

> *"100 is lighthouse's limit, not this website's limit."*
> 
> *"So accessible, so performant, makes me want to consider my career as a front end dev"*
> 
> —— Tom Han 2025


Changes made from the original TechFolios template include:


- **Features**
    - [Animation effects for icons around profile picture](https://tomhcy.com/essays/for-this-site.html#profile-picture-animation)
    - [Implemented dark mode](https://tomhcy.com/essays/for-this-site.html#dark-mode)
    - Added a "Now Playing" Indicator with [Now Playing API](https://github.com/tom21100227/now-playing-api)
    - Clicking my name would cycle through different versions of my name.
    - [Added now page.](https://tomhcy.com/now/)
- **Aesthetics**
    - Layout changes to the home page (bio section under the profile picture)
    - [Added "Last Updated" field to writings/essays that receives updates.](https://tomhcy.com/essays/for-this-site.html#last-updated-for-writings)
    - [Refine the project page logic to include years long project and sort accordingly](https://tomhcy.com/essays/for-this-site.html#project-page-logic)
    - Reworked card layout to adapt for mobile interface and support non-square images.
    - Badges/Pills that represents a coding language/technology change color based on the language and have a little icon along with it. 
- **Accessibility**
    - Badges/Pills with brand color that have low contrast with the background will have a contrasting border to improve visibility, in compliance with WCAG 2.1 AA standards.
    - Using `prefer-contrast` CSS media query to detect if the user prefers high contrast mode, and adjust the styles to be in compliance with WCAG AAA standards.
- **Performance**
    - Smart prefetching and lazy loading of images to improve performance.
    - With GitHub Actions, the site inlines critical CSS and minified JavaScript to reduce render-blocking resources.
- **Miscellaneous**
    - Added a "Last Updated" badge to the footer to indicate when the site was last updated.
    - Removed unnecessary home button on homepage per [@mdrxy](https://github.com/mdrxy) 's request.[^1]

TODO:

- Visitor counter (distinct visitors and page views I guess)
- Add a filter for projects to filter by (programming) language.
- Add a Chinese (Simplified) Version, and the corresponding language toggle.
- Toggle for Dark mode (not necessary)
- AI Summary For Projects (cuz everyone loves that)
- Profile Icons with the latest project that I am working on. 
- Make my cool adaptive badge/pill system more generic so that I can use it for other things.


[^1]: Which is greatly appreciated.
