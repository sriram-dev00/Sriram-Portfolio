PORTFOLIO SITES — built from the michaelgatt.com reference
=============================================================

Two ready-to-run websites sharing one engine:

  /shared/           the layout engine (style.css + app_engine.js) — don't
                      need to touch this unless you want to tweak the
                      look/behavior for both sites at once.

  /video-editor/      your video editing portfolio
                      -> open video-editor/index.html in a browser

  /uiux/               your UI/UX design portfolio
                      -> open uiux/index.html in a browser

HOW TO ADD YOUR CONTENT
------------------------
Everything you'll want to change lives in each folder's data.js file
(NOT the html or css). Two things per project:

1. thumb  — the small clip/image shown on the scattered home wall.
   Put your file in the same folder (e.g. video-editor/media/) and
   set:  thumb: 'media/night-ride-thumb.jpg'

2. media  — the featured video/image on the project's own page:
   media: { type:'video', src:'media/night-ride.mp4' }
   or     { type:'image', src:'media/screen.png' }

Until you fill these in, each spot shows a dashed "+ Add image or
video" placeholder so you can see exactly what's missing.

Each project also has:
  - title, category, short (hover caption), description (project
    page intro), moreInfo (expandable detail)
  - items[] — the row list under the featured media. For the video
    portfolio these are extra cuts/versions (play buttons). For the
    UI/UX portfolio, set type:'view' to show a "View" pill instead
    (for linking out to Figma files, PDFs, etc. — just wrap the row
    click handler in app.js if you want them to open a real link).

SITE-WIDE TEXT
------------------------
Also in data.js, the SITE object controls: your name/role, the hero
headline, nav wording, the "About" and "Contact" page text and
links, and the rotating corner badge text.

HOW TO VIEW / DEPLOY
------------------------
Just open index.html directly in a browser to preview locally.
To publish, upload the whole /portfolio folder (both site folders +
/shared) to any static host (Netlify, Vercel, GitHub Pages) — no
build step needed.

NOTE ON FIDELITY
------------------------
The reference site (michaelgatt.com) uses a full WebGL/3D engine for
its floating gallery. This rebuild reproduces the same structure and
interactions — scattered hover gallery, hover captions, project
pages with a featured video + row list, index view, matching nav
wording — using CSS 3D transforms and vanilla JS so it's lightweight
and easy for you to edit. It won't be a pixel-for-pixel WebGL clone,
but the layout, flow, and feel match closely.
