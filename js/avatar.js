/**
 * CareGuide Avatar Controller — 3D Character Engine
 * ====================================================
 * Controls SVG facial expressions, interactive eye tracking,
 * persona switching (Maya, Aria, Zen), and speech lip sync.
 */

const CareGuideAvatar = (() => {
  let avatarEl = null;
  let bubbleAvatarEl = null;
  let titleEl = null;
  let currentState = 'idle';
  let currentPersona = 'maya';
  let lipSyncInterval = null;

  const STATES = ['idle', 'listening', 'speaking', 'thinking', 'greeting'];
  const PERSONAS = {
    maya: { name: 'Maya • Companion', desc: 'Warm & Helpful' },
    aria: { name: 'Aria • Expert', desc: 'Serene & Precise' },
    zen: { name: 'Zen • Specialist', desc: 'Tech & Speed' }
  };

  function init() {
    avatarEl = document.getElementById('cg-avatar');
    bubbleAvatarEl = document.getElementById('cg-bubble-avatar');
    titleEl = document.getElementById('cg-avatar-name');

    // Attach persona button listeners
    const buttons = document.querySelectorAll('.persona-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const persona = btn.getAttribute('data-persona');
        if (persona) {
          setPersona(persona);
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });

    // Eye tracking mousemove listener on panel
    const panel = document.getElementById('cg-panel');
    if (panel) {
      panel.addEventListener('mousemove', handleMouseMove);
    }
  }

  function setPersona(persona) {
    if (!PERSONAS[persona]) return;
    currentPersona = persona;

    if (avatarEl) avatarEl.setAttribute('data-persona', persona);
    if (bubbleAvatarEl) bubbleAvatarEl.setAttribute('data-persona', persona);
    if (titleEl) titleEl.textContent = PERSONAS[persona].name;

    // Trigger visual pop animation when switching persona
    greet();
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
      'M 68 106 Q 80 122 92 106', // Open smile "Ah"
      'M 72 108 Q 80 114 88 108', // Small "Oh"
      'M 66 104 Q 80 126 94 104', // Wide "Ee"
      'M 70 108 Q 80 118 90 108'  // Neutral talk
    ];

    let index = 0;
    lipSyncInterval = setInterval(() => {
      index = (index + 1) % shapes.length;
      mouthPath.setAttribute('d', shapes[index]);
    }, 180);
  }

  function handleMouseMove(e) {
    if (currentState === 'thinking' || currentState === 'speaking') return;
    if (!avatarEl) return;

    const rect = avatarEl.getBoundingClientRect();
    const avatarCenterX = rect.left + rect.width / 2;
    const avatarCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - avatarCenterX) / 25;
    const deltaY = (e.clientY - avatarCenterY) / 25;

    // Clamp offset range
    const clampX = Math.max(-4, Math.min(4, deltaX));
    const clampY = Math.max(-3, Math.min(3, deltaY));

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
    }, 850);
  }

  function getState() {
    return currentState;
  }

  function getPersona() {
    return currentPersona;
  }

  return {
    init,
    setState,
    setPersona,
    idle,
    listening,
    speaking,
    thinking,
    greet,
    getState,
    getPersona
  };
})();
