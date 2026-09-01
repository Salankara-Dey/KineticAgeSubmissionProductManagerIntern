/**
 * CareGuide Voice Engine — Web Speech API Integration
 * =====================================================
 * Handles speech-to-text (STT) and text-to-speech (TTS)
 * using browser-native Web Speech APIs.
 */

const CareGuideVoice = (() => {
  // ---- State ----
  let recognition = null;
  let synthesis = window.speechSynthesis;
  let isListening = false;
  let isSpeaking = false;
  let selectedVoice = null;
  let voicesLoaded = false;

  // ---- Callbacks ----
  let onResult = null;
  let onInterim = null;
  let onListeningStart = null;
  let onListeningEnd = null;
  let onSpeakStart = null;
  let onSpeakEnd = null;
  let onError = null;

  // ---- Check browser support ----
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSTTSupported = !!SpeechRecognition;
  const isTTSSupported = !!synthesis;

  // ---- Initialize STT ----
  function initSTT() {
    if (!isSTTSupported) return;

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      if (onListeningStart) onListeningStart();
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && onInterim) {
        onInterim(interimTranscript);
      }

      if (finalTranscript && onResult) {
        onResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      isListening = false;
      if (event.error === 'no-speech') {
        // Silence — not a real error for the user
        if (onError) onError('no-speech');
      } else if (event.error === 'not-allowed') {
        if (onError) onError('not-allowed');
      } else {
        if (onError) onError(event.error);
      }
    };

    recognition.onend = () => {
      isListening = false;
      if (onListeningEnd) onListeningEnd();
    };
  }

  // ---- Initialize TTS — voice selection ----
  function initTTS() {
    if (!isTTSSupported) return;

    function selectBestVoice() {
      const voices = synthesis.getVoices();
      if (!voices.length) return;

      voicesLoaded = true;

      // Preferred voice names — warm, clear, female voices work best for care context
      const preferred = [
        'samantha', 'karen', 'zira', 'google us english',
        'microsoft zira', 'microsoft jenny', 'alex', 'daniel',
        'moira', 'fiona', 'tessa', 'victoria'
      ];

      // Try to find a preferred English voice
      for (const pref of preferred) {
        const match = voices.find(v =>
          v.lang.startsWith('en') && v.name.toLowerCase().includes(pref)
        );
        if (match) {
          selectedVoice = match;
          return;
        }
      }

      // Fallback: any English voice
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        selectedVoice = englishVoice;
        return;
      }

      // Last resort: first available voice
      selectedVoice = voices[0];
    }

    // Voices may load asynchronously
    selectBestVoice();
    if (!voicesLoaded) {
      synthesis.onvoiceschanged = selectBestVoice;
    }
  }

  // ---- Start listening ----
  function startListening() {
    if (!isSTTSupported || !recognition) return false;
    if (isListening) {
      recognition.stop();
      return false;
    }

    // Cancel any ongoing speech first
    if (isSpeaking) {
      stopSpeaking();
    }

    try {
      recognition.start();
      return true;
    } catch (e) {
      console.warn('CareGuide Voice: Could not start recognition', e);
      return false;
    }
  }

  // ---- Stop listening ----
  function stopListening() {
    if (!recognition || !isListening) return;
    try {
      recognition.stop();
    } catch (e) {
      // Ignore
    }
  }

  // ---- Speak text ----
  function speak(text) {
    if (!isTTSSupported || !text) return;

    // Cancel any previous speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.88;   // Slightly slower for elderly users
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      if (onSpeakStart) onSpeakStart();
    };

    utterance.onend = () => {
      isSpeaking = false;
      if (onSpeakEnd) onSpeakEnd();
    };

    utterance.onerror = () => {
      isSpeaking = false;
      if (onSpeakEnd) onSpeakEnd();
    };

    // Chrome bug workaround: synthesis pauses on long texts
    // Break into sentences if needed
    synthesis.speak(utterance);
  }

  // ---- Stop speaking ----
  function stopSpeaking() {
    if (!isTTSSupported) return;
    synthesis.cancel();
    isSpeaking = false;
    if (onSpeakEnd) onSpeakEnd();
  }

  // ---- Set callbacks ----
  function setCallbacks(callbacks) {
    onResult = callbacks.onResult || null;
    onInterim = callbacks.onInterim || null;
    onListeningStart = callbacks.onListeningStart || null;
    onListeningEnd = callbacks.onListeningEnd || null;
    onSpeakStart = callbacks.onSpeakStart || null;
    onSpeakEnd = callbacks.onSpeakEnd || null;
    onError = callbacks.onError || null;
  }

  // ---- Init ----
  function init(callbacks) {
    setCallbacks(callbacks);
    initSTT();
    initTTS();
  }

  // ---- Public API ----
  return {
    init,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSTTSupported,
    isTTSSupported,
    get isListening() { return isListening; },
    get isSpeaking() { return isSpeaking; }
  };
})();
