# Portfolio test plan

Local checks: October 26, 2026, headless Microsoft Edge. Responsive checks used 390px and 1280px iframe viewports on all five portfolio pages. These local results do not replace final live-site testing.

Live site: https://chansey4759.github.io/portfolio/

| ID | Testing | Steps | Expected result | Local actual result | Live result |
| --- | --- | --- | --- | --- | --- |
| T1 | Home navigation | Open Home and follow all five navigation links. | Every destination loads; Home marked current. | Pass: link targets exist and current state checked; manual clicks pending. | Not run |
| T2 | About navigation | Repeat T1 from About. | All five pages reachable; About marked current. | Pass: link targets exist and current state checked; manual clicks pending. | Not run |
| T3 | Projects navigation | Repeat T1 from Projects. | All five pages reachable; Projects marked current. | Pass: link targets exist and current state checked; manual clicks pending. | Not run |
| T4 | Skills navigation | Repeat T1 from Skills. | All five pages reachable; Skills marked current. | Pass: link targets exist and current state checked; manual clicks pending. | Not run |
| T5 | Contact navigation | Repeat T1 from Contact. | All five pages reachable; Contact marked current. | Pass: link targets exist and current state checked; manual clicks pending. | Not run |
| T6 | Phone layouts | Open each page at 390px, in light and dark themes; inspect horizontal overflow. | Content fits without sideways scrolling. | Pass: no horizontal overflow on all five pages in both themes. | Not run |
| T7 | Laptop layouts | Repeat T6 at 1280px. | Content fits; desktop navigation visible. | Pass after desktop visibility safeguard; initial hidden-state check failed during resize. | Not run |
| T8 | Mobile navigation | At 390px on every page, activate Menu; press Escape. | Menu opens with expanded state, then closes and focuses button. | Pass: open, expanded state, and Escape close checked through browser events. Physical key testing pending. | Not run |
| T9 | Light/dark toggle | On every page, activate theme control twice. | Light changes to dark, then back to light. | Pass on all five pages. | Not run |
| T10 | Theme persistence | Select dark, navigate to another page, reload; repeat for light. | Chosen theme persists where storage is available. | Not run as a dedicated persistence test. | Not run |
| T11 | Skills groups | On Skills expand and collapse all three groups using mouse and keyboard. | All 12 skills available; each group toggles independently. | Pass: three native details groups and all 12 skills present; manual interaction pending. | Not run |
| T12 | Keyboard and skip link | On every page use Tab, Shift+Tab, Enter and Space through navigation, controls and content; activate skip link. | Visible focus, logical order, no traps; skip link reaches main. | Not run manually. | Not run |
| T13 | Accessibility | Run Lighthouse Accessibility on every page in Chrome DevTools. Record individual scores. | Each score at least 90. | Not run; no scores claimed. | Not run |
| T14 | Projects and images | Open Projects, inspect poster, follow calculator link, and return. | Poster and calculator load at relative URLs; placeholders remain inactive. | Pass: local image and link destinations exist; calculator files have no changes. | Not run |
| T15 | Contact | Open Contact; activate email link; read Discord username. | Email application opens for Thomas90827@gmail.com; Discord is chansey4759. | Pass: source link and username retained; email application launch not tested. | Not run |
| T16 | JavaScript disabled | Disable JavaScript and open all five pages at phone and laptop sizes. | Navigation and essential content remain accessible; theme follows system preference. | Not run in browser. | Not run |
| T17 | Console | Open each page, operate menu and theme toggle with console visible. | No JavaScript errors. | Not run with console inspection. | Not run |

## Fix and retest log

### Crazy Button checks

Local headless Edge check on October 26, 2026: Pass for the first warning, second expanded warning, third-press activation, 200ms interval, rainbow class assignment, unchanged stop-control colors, stopping/resetting, and Escape. The interval was intercepted and invoked manually so no flashing was displayed during testing. Source checks confirmed one footer button on each of the five portfolio pages and no calculator changes. Live testing, reduced-motion emulation, physical keyboard activation, and background-tab behavior are Not run.

To retest, activate the button once and twice and verify the exact requested warnings without color changes. Intercept the interval in a browser test before the third activation; verify the 200ms interval, invoke one tick, then stop using the button and Escape in separate runs. Confirm original theme colors return. With reduced motion enabled, the third activation must show the disabled notice instead. Leaving the page or hiding its tab should reset the effect. Never mark live results as passed based on local checks.

- October 26: Initial responsive harness flagged desktop navigation's hidden attribute after changing from phone width. Added a desktop CSS visibility safeguard and checked computed visibility rather than the attribute alone. Retest passed on all five pages.
- Final grading tests must be run on the deployed site. Preserve failed results and add the fix and retest date rather than overwriting failures.
