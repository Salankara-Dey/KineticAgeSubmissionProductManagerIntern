/**
 * CareGuide Avatar Controller
 * ==============================
 * Controls the SVG avatar face animations by
 * toggling CSS state classes.
 */

const CareGuideAvatar = (() => {
  let avatarEl = null;
  let currentState = 'idle';
  const STATES = ['idle', 'listening', 'speaking', 'thinking', 'greeting'];

  function init() {
    avatarEl = document.getElementById('cg-avatar');
  }

  function setState(state) {
    if (!avatarEl) return;
    if (!STATES.includes(state)) {
      console.warn('CareGuide Avatar: Unknown state', state);
      return;
    }

    // Remove all state classes
    STATES.forEach(s => avatarEl.classList.remove(`state-${s}`));

    // Add new state
    avatarEl.classList.add(`state-${state}`);
    currentState = state;
  }

  function idle()      { setState('idle'); }
  function listening() { setState('listening'); }
  function speaking()  { setState('speaking'); }
  function thinking()  { setState('thinking'); }

  function greet() {
    setState('greeting');
    // Return to idle after animation
    setTimeout(() => {
      if (currentState === 'greeting') {
        setState('idle');
      }
    }, 800);
  }

  function getState() {
    return currentState;
  }

  return {
    init,
    setState,
    idle,
    listening,
    speaking,
    thinking,
    greet,
    getState
  };
})();
