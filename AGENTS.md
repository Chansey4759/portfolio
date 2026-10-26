# Portfolio project rules

## Purpose and scope

Build a personal portfolio for a class assignment. Keep the code simple enough for the owner to understand and explain during a three-minute demo. Work on one small task at a time, follow these rules for every change, and update this file when agreed design or project requirements change.

The site must have five separate pages, with links to all five in the navigation on every page:

- `index.html`: Home, with a brief personal introduction.
- `about.html`: About Me, including background, education, and interests.
- `projects.html`: At least three projects, each with a description, an image or screenshot, and a meaningful link when applicable. Class projects count.
- `skills.html`: Technical skills and proficiencies described honestly.
- `contact.html`: Real contact information, including an email link.

Use real content supplied or approved by the owner. Do not invent personal details, qualifications, projects, contact information, or testimonials. Ask for missing content when it is needed; do not treat placeholder text or empty sections as finished work.

## Static site and GitHub Pages

- Use plain HTML5, CSS, and JavaScript only. No frameworks, component libraries, package dependencies, or required build step.
- The deployed site is static files served by GitHub Pages. Do not introduce a backend, server runtime, serverless functions, compute services, databases, authentication services, or secret API keys.
- Keep all five HTML pages and one shared external stylesheet (`styles.css`) at the repository root. Put shared JavaScript in `script.js` and images in `assets/images/`.
- Use relative paths such as `about.html`, `styles.css`, and `assets/images/project.webp` for internal links and assets. Do not use root-relative paths such as `/styles.css`; this site is hosted under `/portfolio/`.
- Use explicit `.html` links. Do not depend on client-side routing, URL rewrites, or extensionless routes.
- Publish from the `main` branch and the repository root (`/`). Do not introduce a deployment service or build workflow unless the owner changes the requirements.
- Expected live URL: `https://Chansey4759.github.io/portfolio/`. Verify the actual Pages configuration and live URL before reporting deployment as complete.
- A contact form cannot send messages on its own. Prefer a clear email link. If a form is requested, validate inputs with JavaScript, explain that it opens the visitor's email application, and never claim a message was sent.

## Design direction

Until the owner chooses another design, use a clean, readable portfolio with generous spacing, simple project cards, and consistent layouts across all pages.

- Colors: off-white background (`#f8fafc`), dark navy text (`#0f172a`), white surfaces (`#ffffff`), and blue accents (`#1d4ed8`). Check contrast for the actual color combinations used.
- Typography: use a local system font stack such as `system-ui, -apple-system, "Segoe UI", sans-serif`; no external font dependency.
- Use a mobile-first layout, a comfortable reading width, and CSS media queries for phone and laptop layouts. Avoid sideways scrolling.
- Keep the header, navigation, footer, spacing, colors, and typography consistent across pages.
- Put all styling in `styles.css`; no inline styles or page-specific `<style>` blocks. Use CSS custom properties for shared colors and spacing.
- Keep animations subtle and respect `prefers-reduced-motion`.
- The five portfolio pages share root-level `styles.css` and `script.js`. Theme colors use CSS custom properties, follow the system preference by default, and can be overridden with a saved light/dark choice. Use the shared card, header, navigation, and footer patterns for new content.
- Leave the existing calculator and all files inside `projects/Centurion-Showdown-Coding-services-/` unchanged unless the owner explicitly requests calculator changes. Its separate design is intentional.

## HTML, accessibility, and JavaScript

- Use semantic HTML, including `header`, `nav`, `main`, `section`, and `footer` where appropriate.
- Each page needs a descriptive title, a viewport meta tag, an English language declaration, exactly one `h1`, and logically ordered headings.
- Give every image an `alt` attribute. Use descriptive alt text for meaningful images and an empty value for purely decorative images.
- Optimize each image to less than 500 KB. Preserve its aspect ratio and provide image dimensions where practical.
- Use real links for navigation and buttons for actions. Provide visible keyboard focus, accessible control names, and associated labels for form inputs.
- Include a skip-to-content link and mark the current navigation link with `aria-current="page"`.
- Every applicable link, button, and field must be usable by keyboard. Test Tab, Shift+Tab, Enter, and Space where appropriate.
- Implement at least two working JavaScript features: a responsive navigation menu that opens and closes, plus a light/dark theme toggle as the default second feature. An owner-approved alternative may replace the theme toggle.
- The menu button must expose its state with `aria-expanded` and identify its controlled menu with `aria-controls`. Keep navigation usable if JavaScript is unavailable.
- Keep essential content available without JavaScript. Use small, readable functions and explain non-obvious logic. Avoid unnecessary abstractions and browser console errors.
- Aim for a Lighthouse Accessibility score of at least 90 on every page; record measured scores, not estimates.

## Working and saving checkpoints

- Before editing, inspect the working tree and relevant files. Preserve existing user work and avoid unrelated changes.
- Implement the requested task completely, then perform the checks appropriate to that change. For site changes, preview locally, check a phone-sized viewport and a laptop viewport, and test keyboard use. VS Code Live Preview is suitable; a local preview tool is for development only and must not become a deployment requirement.
- After each completed task, automatically create a small Git checkpoint: review the diff, stage only task-related files, commit with a clear descriptive message, and push to GitHub. This instruction authorizes routine commits and pushes for completed project tasks; do not repeatedly ask for confirmation unless the tool or environment requires approval.
- Inspect the current branch and remote before pushing. Use the configured `origin` and the intended project branch; do not change repository visibility, remotes, or branch protections without instruction.
- Never commit credentials, private information not intended for publication, temporary preview files, or unrelated user changes.
- If authentication, network access, permissions, or a remote conflict prevents a push, report the exact blocker and whether the checkpoint exists locally. Never claim that unsaved or unpushed work is saved on GitHub.
- Do not use force push, destructive reset, or history rewriting. Undo published changes with a new revert commit. Resolve conflicts without discarding user work.
- After a push that changes the site, verify the live GitHub Pages version when accessible. A successful push alone does not prove that deployment succeeded.
- Keep an honest history of steady work over multiple days. Never fabricate, backdate, or split empty changes to simulate activity.
- End each task with a concise explanation of what changed, checks actually run, any remaining issues, and the commit/push status so the owner can review and understand the work.

## Testing and documentation

Maintain `TESTING.md` with at least 12 meaningful test cases. Each case must include an ID, what is being tested, steps, expected result, and actual Pass/Fail result after execution. Mark unexecuted tests as Not run rather than inventing results.

Coverage must include:

- Every navigation link on every page.
- Every page at phone and laptop viewport sizes, including horizontal overflow checks.
- Every JavaScript feature, including opening and closing the mobile menu and both theme states. If a contact form is added, test valid and invalid inputs.
- Keyboard navigation on every page.
- Lighthouse Accessibility scores on every page.
- Working links and images on the deployed GitHub Pages site.

Run the required final tests on the live site as well as local previews. Record the URL and test date. Keep failed results, document fixes, and record retest outcomes. Never report checks as passed if they were not performed.

Keep `README.md` current with the project description, live site link, instructions for local viewing, and acknowledgments for any borrowed assets or code.

When preparing final submission, help produce an honest one-to-two-page report with repository and live links at the top, a feature overview, challenges and solutions, one actual Codex mistake and its correction, and phone and laptop screenshots. Do not invent a mistake or test evidence. The owner should be able to demonstrate both layouts, navigate by keyboard, and explain any JavaScript function selected by the instructor.

## Assignment checkpoints

- Week 1: Repository and Pages configured, these rules reviewed by the owner, and all five linked pages containing real content.
- Week 2: Consistent responsive styling, both JavaScript features working, and `TESTING.md` started.
- Week 3: Accessibility fixes, completed live-site tests, updated README, screenshots, and final report.

Do not mark a checkpoint complete until its requirements are actually met. Building the website is separate from drafting these rules; do not start unrelated implementation unless requested.
