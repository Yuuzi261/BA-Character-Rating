import { watch } from 'vue';
import { useEscapeKey } from '@/composables/useEscapeKey.js';

/**
 * A Composable for managing common Modal logic, including closing on the Esc key and preventing the background from scrolling.
 * @param {import('vue').Ref<boolean>} isVisible - A ref that controls the visibility of the Modal.
 * @param {Function} closeFn - Function used to close the Modal.
 */
export function useModal(isVisible, closeFn) {
  useEscapeKey(isVisible, closeFn);

  // Lock or unlock background scrolling when Modal visibility changes
  watch(isVisible, (newValue) => {
    if (newValue) {
      // Before hiding the scrollbar, calculate its width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Check if scrollbar exists (width greater than 0)
      if (scrollbarWidth > 0) {
        // Get the currently calculated padding-right value of body
        const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
        
        // Set a new padding-right value of "original padding + scrollbar width"
        // Using CSS's calc() function can handle unit issues elegantly
        document.body.style.paddingRight = `calc(${originalPaddingRight} + ${scrollbarWidth}px)`;
      }
      
      // Hide scrollbars, lock scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // When the Modal is closed, delay for a short time before resuming scrolling to ensure that the Modal closing animation is completed
      setTimeout(() => {
        // Remove inline styles and return the body style to the original state defined in the CSS file
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 300); // The time set here should be consistent with the animation.
      // Currently, all Modals have a fixed 0.3 second animation, so it is hard-coded for the time being.
    }
  });
}
