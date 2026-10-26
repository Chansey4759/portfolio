# portfolio

Thomas Peters' personal portfolio, built with static HTML, CSS, and JavaScript.

Live site: https://chansey4759.github.io/portfolio/

To view locally, open `index.html` in a browser or use VS Code Live Preview.

## Design and controls

The homepage is a four-chapter scrolling journey through About, Projects, Skills, and Contact. A desktop route guide highlights the current chapter and updates a progress indicator through `journey.js`. Chapter links jump within the homepage, and each chapter links to its full page. Scrolling is never locked or intercepted. Content stays visible without JavaScript, and smooth scrolling only applies when reduced motion is not requested.

All five portfolio pages share `styles.css` and `script.js`. Edit the color custom properties to adjust the light and dark palettes. The theme follows the system setting until the visitor chooses Light mode or Dark mode; their choice is saved when browser storage is available. The mobile Menu button opens the navigation, and Escape closes it. Navigation remains visible without JavaScript. Skills groups use native HTML expand/collapse controls.

The calculator retains its original design and code independently of the portfolio theme.

Each portfolio footer also has a Crazy Button. The first two presses show warnings; the third starts random rainbow text and background changes every 40ms (25 times per second); individual characters have transparent backgrounds. Stop Crazy Colors or Escape restores the page. The effect stops when the page is hidden and is blocked when reduced motion is requested. It never changes the saved theme or runs in the calculator.

## Photo credits

The portfolio uses existing Pexels photos downloaded as optimized 1200 × 600 JPEGs under `assets/images/`, each below 500 KB. These are thematic stock photos, not photos of Thomas or claims about his own work. Each page has a visible source link. Photos change hue during Crazy mode and return to their original appearance when it stops.

| Page | Local image | Original source |
| --- | --- | --- |
| Home | `home-engineering.jpg` | [Pliers and gear](https://www.pexels.com/photo/close-up-photo-of-pliers-beside-a-gear-9242914/) |
| About | `about-study.jpg` | [Notebooks on a desk](https://www.pexels.com/photo/notebooks-on-a-desk-5124877/) |
| Projects | `projects-gaming.jpg` | [Game controller](https://www.pexels.com/photo/person-holding-a-black-game-controller-7855652/) |
| Skills | `skills-workshop.jpg` | [Creative workbench](https://www.pexels.com/photo/tools-on-desk-in-workplace-5963135/) |
| Contact | `contact-workspace.jpg` | [Desk workspace](https://www.pexels.com/photo/a-desk-workspace-5186349/) |

Usage terms: [Pexels License](https://www.pexels.com/license/).

The Projects page no longer displays the stock gaming banner; the photo remains in the homepage story. The Contact page uses `assets/images/discord-logo.svg`, downloaded from [Discord's official brand assets](https://discord.com/branding), instead of the stock workspace photo. The workspace photo remains in the homepage story. Discord owns its logo.

## Featured project

The Projects page includes a local copy of the [Centurion Showdown damage calculator](https://github.com/Chansey4759/Centurion-Showdown-Coding-services-) from source commit `533c4a44f8201a8892ecb2e35046f6a5ff29292f`, hosted at `projects/Centurion-Showdown-Coding-services-/`. Its poster is resized and compressed for the web. The original credits for Isaac's game and Chansey4759's calculator are preserved.

Two project slots are intentionally labeled `PLACEHOLDER!!!!!` until their names, content, and links are supplied.
