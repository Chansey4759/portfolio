// Scroll normally; the route simply highlights the chapter nearest the reader.
const storySteps = [...document.querySelectorAll('.story-step')];
const storyLinks = [...document.querySelectorAll('[data-chapter-link]')];
const journeyProgress = document.querySelector('#journey-progress');
let journeyFrame = null;
function updateJourney() {
  journeyFrame = null;
  const readingLine = window.innerHeight * 0.5;
  let current = -1;
  storySteps.forEach((step, index) => {
    if (step.getBoundingClientRect().top <= readingLine) current = index;
  });
  storySteps.forEach((step, index) => step.classList.toggle('is-current', index === current));
  storyLinks.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  journeyProgress.value = current + 1;
}
function scheduleJourneyUpdate() {
  if (journeyFrame === null) journeyFrame = requestAnimationFrame(updateJourney);
}
window.addEventListener('scroll', scheduleJourneyUpdate, { passive: true });
window.addEventListener('resize', scheduleJourneyUpdate);
window.addEventListener('load', scheduleJourneyUpdate);
updateJourney();
