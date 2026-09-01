/**
 * CareGuide Widget Controller
 * ===============================
 * Orchestrates the floating widget UI — connects the
 * AI brain, voice engine, avatar animations, and SPA router.
 */

const CareGuideWidget = (() => {
  // ---- DOM refs ----
  let bubble, panel, chatArea, textInput, sendBtn, micBtn;
  let liveTranscript, voiceIndicator, browserNotice;

  // ---- State ----
  let isOpen = false;
  let isProcessing = false;
  let hasGreeted = false;

  // ---- Initialize ----
  function init() {
    // Get DOM refs
    bubble = document.getElementById('cg-bubble');
    panel = document.getElementById('cg-panel');
    chatArea = document.getElementById('cg-chat-area');
    textInput = document.getElementById('cg-text-input');
    sendBtn = document.getElementById('cg-send-btn');
    micBtn = document.getElementById('cg-mic-btn');
    liveTranscript = document.getElementById('cg-live-transcript');
    voiceIndicator = document.getElementById('cg-voice-indicator');
    browserNotice = document.getElementById('cg-browser-notice');

    // Init avatar
    CareGuideAvatar.init();

    // Init voice engine
    CareGuideVoice.init({
      onResult: handleVoiceResult,
      onInterim: handleInterimResult,
      onListeningStart: handleListeningStart,
      onListeningEnd: handleListeningEnd,
      onSpeakStart: handleSpeakStart,
      onSpeakEnd: handleSpeakEnd,
      onError: handleVoiceError
    });

    // Check voice support
    if (!CareGuideVoice.isSTTSupported) {
      micBtn.classList.add('unsupported');
      browserNotice.classList.add('visible');
    }

    // Event listeners
    bubble.addEventListener('click', open);
    bubble.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    document.getElementById('cg-close-btn').addEventListener('click', close);

    sendBtn.addEventListener('click', handleSend);
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    textInput.addEventListener('input', () => {
      sendBtn.classList.toggle('active', textInput.value.trim().length > 0);
    });

    micBtn.addEventListener('click', handleMicClick);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  // ---- Open widget ----
  function open() {
    isOpen = true;
    bubble.classList.add('hidden');
    panel.classList.add('open');
    textInput.focus();

    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        CareGuideAvatar.greet();
        addAssistantMessage(
          "Hello! 😊 I'm CareGuide, your voice assistant. I can help you navigate this website.\n\nTry saying or typing things like:\n• \"Book a visit\"\n• \"Show my care plan\"\n• \"Find a caregiver\"\n• \"Contact support\"\n\nHow can I help you today?"
        );
      }, 300);
    }
  }

  // ---- Close widget ----
  function close() {
    isOpen = false;
    panel.classList.remove('open');
    setTimeout(() => {
      bubble.classList.remove('hidden');
    }, 300);

    // Stop any ongoing voice activity
    CareGuideVoice.stopListening();
    CareGuideVoice.stopSpeaking();
    CareGuideAvatar.idle();
  }

  // ---- Handle text send ----
  function handleSend() {
    const text = textInput.value.trim();
    if (!text || isProcessing) return;

    textInput.value = '';
    sendBtn.classList.remove('active');
    processUserInput(text);
  }

  // ---- Handle mic click ----
  function handleMicClick() {
    if (isProcessing) return;

    if (CareGuideVoice.isListening) {
      CareGuideVoice.stopListening();
    } else {
      CareGuideVoice.startListening();
    }
  }

  // ---- Process user input ----
  function processUserInput(text) {
    if (isProcessing) return;
    isProcessing = true;

    // Show user message
    addUserMessage(text);

    // Show thinking state
    CareGuideAvatar.thinking();
    const typingEl = addTypingIndicator();

    // Simulate brief "thinking" delay for natural feel
    const thinkTime = 400 + Math.random() * 600;

    setTimeout(() => {
      // Remove typing indicator
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
      }

      // Process with brain
      const result = CareGuideBrain.processInput(text);

      // Show response
      addAssistantMessage(result.response, result.navigate, result.navLabel);

      // Speak response
      CareGuideVoice.speak(result.response.replace(/[•\n]/g, '. ').replace(/😊/g, ''));

      // Navigate if needed
      if (result.navigate) {
        setTimeout(() => {
          CareGuideApp.navigateTo(result.navigate);
        }, 1200);
      }

      isProcessing = false;
    }, thinkTime);
  }

  // ---- Voice callbacks ----
  function handleVoiceResult(transcript) {
    liveTranscript.textContent = '';
    liveTranscript.classList.remove('active');
    processUserInput(transcript);
  }

  function handleInterimResult(transcript) {
    liveTranscript.textContent = `"${transcript}..."`;
    liveTranscript.classList.add('active');
  }

  function handleListeningStart() {
    micBtn.classList.add('listening');
    voiceIndicator.classList.add('active');
    CareGuideAvatar.listening();
  }

  function handleListeningEnd() {
    micBtn.classList.remove('listening');
    voiceIndicator.classList.remove('active');
    liveTranscript.textContent = '';
    liveTranscript.classList.remove('active');
    if (!isProcessing) {
      CareGuideAvatar.idle();
    }
  }

  function handleSpeakStart() {
    CareGuideAvatar.speaking();
  }

  function handleSpeakEnd() {
    CareGuideAvatar.idle();
  }

  function handleVoiceError(error) {
    if (error === 'no-speech') {
      addAssistantMessage("I didn't hear anything. Try clicking the microphone and speaking, or just type your question below.");
    } else if (error === 'not-allowed') {
      addAssistantMessage("It looks like microphone access was blocked. Please allow microphone access in your browser settings, or you can type your questions instead.");
      micBtn.classList.add('unsupported');
    }
    CareGuideAvatar.idle();
  }

  // ---- Message rendering ----
  function addUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'cg-message cg-message--user';
    msgEl.innerHTML = `
      <div class="cg-message-avatar">👤</div>
      <div class="cg-message-bubble">${escapeHtml(text)}</div>
    `;
    chatArea.appendChild(msgEl);
    scrollToBottom();
  }

  function addAssistantMessage(text, navigate, navLabel) {
    const msgEl = document.createElement('div');
    msgEl.className = 'cg-message cg-message--assistant';

    // Format text with line breaks
    const formattedText = escapeHtml(text).replace(/\n/g, '<br>');

    let navBadge = '';
    if (navigate && navLabel) {
      navBadge = `
        <div class="cg-nav-badge">
          <span class="nav-icon">📍</span>
          Navigating to: ${escapeHtml(navLabel)}
        </div>
      `;
    }

    msgEl.innerHTML = `
      <div class="cg-message-avatar">🤖</div>
      <div class="cg-message-bubble">
        ${formattedText}
        ${navBadge}
      </div>
    `;
    chatArea.appendChild(msgEl);
    scrollToBottom();
  }

  function addTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'cg-message cg-message--assistant';
    typingEl.innerHTML = `
      <div class="cg-message-avatar">🤖</div>
      <div class="cg-typing">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
    chatArea.appendChild(typingEl);
    scrollToBottom();
    return typingEl;
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatArea.scrollTop = chatArea.scrollHeight;
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ---- Public API ----
  return {
    init,
    open,
    close
  };
})();

// ============================================
// BOOTSTRAP — Start everything when DOM is ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  CareGuideApp.init();
  CareGuideWidget.init();
});
