/**
 * Easing function for a smooth acceleration and deceleration.
 * @param {number} t - current time
 * @param {number} b - start value
 * @param {number} c - change in value
 * @param {number} d - duration
 */
const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

/**
 * A utility function to smoothly scroll to an element over a given duration.
 * @param {HTMLElement} element - The target element to scroll to.
 * @param {number} duration - The duration of the scroll animation in milliseconds.
 * @param {function} onComplete - A callback function to execute when the scroll is finished.
 * @param {number} offset - A pixel offset to adjust the final scroll position.
 */
export const smoothScrollTo = (element, duration, onComplete, offset) => {
  const startPosition = window.pageYOffset;
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else if (onComplete) {
      onComplete();
    }
  };

  requestAnimationFrame(animation);
};