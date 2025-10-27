import { useCallback } from 'react';

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
 * A custom hook that provides a function to smoothly scroll to an element.
 * @returns {function} A function to trigger the scroll.
 */
export const useSmoothScroll = () => {
  const scrollTo = useCallback((element, duration = 1500, onComplete, offset = 0) => {
    if (!element) return;

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
  }, []);

  return scrollTo;
};