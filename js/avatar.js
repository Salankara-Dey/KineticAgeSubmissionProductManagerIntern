/**
 * CareGuide Professional Avatar Controller
 * ====================================================
 * Controls SVG facial expressions, interactive pupil glance,
 * and natural speech lip sync.
 */

const CareGuideAvatar = (() => {
  let avatarEl = null;
  let bubbleAvatarEl = null;
  let titleEl = null;
  let currentState = 'idle';
  let lipSyncInterval = null;

  const STATES = ['idle', 'listening', 'speaking', 'thinking', 'greeting'];

  function init() {
    avatarEl = document.getElementById('cg-avatar');
    bubbleAvatarEl = document.getElementById('cg-bubble-avatar');
    titleEl = document.getElementById('cg-avatar-name');

    // Eye tracking mousemove listener on panel
    const panel = document.getElementById('cg-panel');
    if (panel) {
      panel.addEventListener('mousemove', handleMouseMove);
    }
  }

  function setState(state) {
    if (!avatarEl) return;
    if (!STATES.includes(state)) {
      console.warn('CareGuide Avatar: Unknown state', state);
      return;
    }

    // Clear any previous lip-sync interval
    if (lipSyncInterval) {
      clearInterval(lipSyncInterval);
      lipSyncInterval = null;
    }

    // Remove all state classes
    STATES.forEach(s => avatarEl.classList.remove(`state-${s}`));

    // Add new state class
    avatarEl.classList.add(`state-${state}`);
    currentState = state;

    // Start lip-sync cycling if speaking
    if (state === 'speaking') {
      startLipSync();
    }
  }

  function startLipSync() {
    const mouthPath = avatarEl.querySelector('.avatar-mouth');
    if (!mouthPath) return;

    const shapes = [
      'M 66 102 Q 80 114 94 102', // Smile
      'M 68 101 Q 80 108 92 101', // Natural small open
      'M 65 102 Q 80 118 95 102', // Slightly wider open
      'M 67 101 Q 80 110 93 101'  // Neutral talk
    ];

    let index = 0;
    lipSyncInterval = setInterval(() => {
      index = (index + 1) % shapes.length;
      mouthPath.setAttribute('d', shapes[index]);
    }, 190);
  }

  function handleMouseMove(e) {
    if (currentState === 'thinking' || currentState === 'speaking') return;
    if (!avatarEl) return;

    const rect = avatarEl.getBoundingClientRect();
    const avatarCenterX = rect.left + rect.width / 2;
    const avatarCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - avatarCenterX) / 35;
    const deltaY = (e.clientY - avatarCenterY) / 35;

    // Clamp offset range for subtle natural glance
    const clampX = Math.max(-2.5, Math.min(2.5, deltaX));
    const clampY = Math.max(-2.0, Math.min(2.0, deltaY));

    const pupilsLeft = avatarEl.querySelectorAll('.avatar-pupil-left');
    const pupilsRight = avatarEl.querySelectorAll('.avatar-pupil-right');

    pupilsLeft.forEach(p => {
      p.style.transform = `translate(${clampX}px, ${clampY}px)`;
    });
    pupilsRight.forEach(p => {
      p.style.transform = `translate(${clampX}px, ${clampY}px)`;
    });
  }

  function idle()      { setState('idle'); }
  function listening() { setState('listening'); }
  function speaking()  { setState('speaking'); }
  function thinking()  { setState('thinking'); }

  function greet() {
    setState('greeting');
    setTimeout(() => {
      if (currentState === 'greeting') {
        setState('idle');
      }
    }, 700);
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
