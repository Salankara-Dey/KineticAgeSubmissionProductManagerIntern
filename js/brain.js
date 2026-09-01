/**
 * CareGuide AI Brain — Intent Recognition Engine
 * ================================================
 * Maps user speech/text to site navigation intents using
 * weighted keyword matching with fuzzy scoring.
 */

const CareGuideBrain = (() => {
  // ---- Intent Definitions ----
  const intents = [
    {
      id: 'book_visit',
      keywords: ['book', 'booking', 'schedule', 'appointment', 'visit', 'nurse', 'doctor', 'home visit', 'reserve', 'arrange', 'set up'],
      strongKeywords: ['book', 'booking', 'appointment', 'schedule', 'visit'],
      phrases: ['book a visit', 'schedule a visit', 'i need someone to come', 'need a nurse', 'arrange a visit', 'book an appointment', 'schedule appointment', 'make an appointment', 'home visit'],
      responses: [
        "I'll take you to the booking page now. You can pick a date, choose a time, and select your preferred caregiver there.",
        "Let me open the booking page for you. It's easy — just pick a date and tell us what kind of visit you need.",
        "Sure! I'm taking you to Book a Visit. You'll be able to schedule everything right there."
      ],
      navigate: '#/book',
      navLabel: 'Book a Visit'
    },
    {
      id: 'care_plan',
      keywords: ['care plan', 'plan', 'medication', 'medications', 'medicine', 'pills', 'prescription', 'daily schedule', 'my schedule', 'routine', 'health plan', 'treatment'],
      strongKeywords: ['care plan', 'medication', 'medications', 'prescription'],
      phrases: ['my care plan', 'show my care plan', 'what medications', 'my medicine', 'daily schedule', 'what is my schedule', 'show my medications', 'treatment plan', 'my health plan'],
      responses: [
        "Let me pull up your care plan. You'll see your medications, daily schedule, and any notes from your caregiver.",
        "Here's your care plan! It has everything — your medications, schedule, and caregiver notes all in one place.",
        "I'm opening your care plan now. You can check your medications, daily routine, and any important notes."
      ],
      navigate: '#/care-plan',
      navLabel: 'My Care Plan'
    },
    {
      id: 'find_caregiver',
      keywords: ['caregiver', 'caregivers', 'nurse', 'helper', 'find', 'search', 'available', 'who', 'staff', 'team', 'workers', 'aide', 'companion'],
      strongKeywords: ['caregiver', 'caregivers', 'find caregiver'],
      phrases: ['find a caregiver', 'available caregivers', 'who can help', 'find a nurse', 'caregiver near me', 'available nurses', 'show caregivers', 'i need a caregiver', 'looking for a caregiver', 'find someone'],
      responses: [
        "Here are the caregivers available in your area. You can see their specialties, ratings, and availability.",
        "I'm showing you our caregiver directory. Each one has their experience, specialties, and reviews listed.",
        "Let me take you to Find a Caregiver. You can browse profiles and pick someone who's the right fit."
      ],
      navigate: '#/caregivers',
      navLabel: 'Find a Caregiver'
    },
    {
      id: 'contact',
      keywords: ['contact', 'phone', 'call', 'number', 'email', 'reach', 'talk', 'speak', 'support', 'help line', 'helpline', 'emergency', 'urgent'],
      strongKeywords: ['contact', 'phone number', 'call', 'emergency'],
      phrases: ['contact support', 'phone number', 'call someone', 'how to contact', 'i need help', 'talk to someone', 'get in touch', 'reach out', 'contact us', 'emergency number', 'need to call'],
      responses: [
        "I'll take you to our contact page. You can call us directly at (555) 234-5678, or send a message.",
        "Here's our contact page! The phone number is (555) 234-5678. You can also email or send a message right from the page.",
        "Let me open the contact page for you. For emergencies, call 911 — for care questions, our number is (555) 234-5678."
      ],
      navigate: '#/contact',
      navLabel: 'Contact Support'
    },
    {
      id: 'services',
      keywords: ['services', 'service', 'offer', 'provide', 'faq', 'question', 'questions', 'what do you', 'options', 'types', 'kinds', 'programs', 'insurance', 'cost', 'price', 'pricing'],
      strongKeywords: ['services', 'faq', 'what do you offer'],
      phrases: ['what services', 'what do you offer', 'types of care', 'show me services', 'frequently asked questions', 'your services', 'what care', 'how much does it cost', 'insurance', 'pricing'],
      responses: [
        "Let me show you our services page. You'll find everything we offer and answers to common questions.",
        "I'm taking you to Services & FAQs. You can see all our care options and get answers to common questions.",
        "Here's our services overview! We have home nursing, companionship, therapy, and more. The FAQ section has lots of helpful info too."
      ],
      navigate: '#/services',
      navLabel: 'Services & FAQs'
    },
    {
      id: 'home',
      keywords: ['home', 'main', 'start', 'beginning', 'homepage', 'front page', 'go back', 'back'],
      strongKeywords: ['home page', 'go home', 'main page'],
      phrases: ['go home', 'take me home', 'main page', 'start page', 'go to home', 'back to start', 'go to the beginning', 'front page'],
      responses: [
        "Taking you back to the home page.",
        "Sure, heading back to the main page now.",
        "Here we go — back to the home page!"
      ],
      navigate: '#/',
      navLabel: 'Home'
    },
    {
      id: 'greeting',
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
      strongKeywords: ['hello', 'hi', 'hey'],
      phrases: ['hello', 'hi there', 'hey there', 'good morning', 'good afternoon', 'good evening'],
      responses: [
        "Hello! I'm CareGuide, your voice assistant. How can I help you today? You can ask me to book a visit, find a caregiver, or anything else on the site.",
        "Hi there! 😊 I'm CareGuide. What can I help you with? Try saying something like 'book a visit' or 'find a caregiver'.",
        "Hey! Welcome to Sunrise Senior Care. I'm here to help you navigate the site. Just tell me what you're looking for!"
      ],
      navigate: null,
      navLabel: null
    },
    {
      id: 'thanks',
      keywords: ['thank', 'thanks', 'thank you', 'appreciate', 'great', 'awesome', 'perfect', 'wonderful'],
      strongKeywords: ['thank you', 'thanks'],
      phrases: ['thank you', 'thanks a lot', 'that was helpful', 'you are great', 'appreciate it'],
      responses: [
        "You're very welcome! Let me know if you need anything else. 😊",
        "Happy to help! Is there anything else I can assist you with?",
        "Glad I could help! Don't hesitate to ask if you have more questions."
      ],
      navigate: null,
      navLabel: null
    },
    {
      id: 'who_are_you',
      keywords: ['who are you', 'what are you', 'are you real', 'are you human', 'your name', 'ai', 'robot', 'bot'],
      strongKeywords: ['who are you', 'are you real', 'are you human'],
      phrases: ['who are you', 'what are you', 'are you a real person', 'are you human', 'are you a robot', 'what is your name', 'are you ai'],
      responses: [
        "I'm CareGuide, an AI assistant here to help you navigate this website. I'm not a human, but I'm designed to make things easier for you! Just ask me anything about the site.",
        "Great question! I'm CareGuide — an AI voice assistant. I help you find things on this website without having to search through menus. I'm not a person, but I'm here to help!",
        "I'm CareGuide, your AI helper on this website. Think of me as a friendly guide that can take you anywhere on the site — just ask!"
      ],
      navigate: null,
      navLabel: null
    },
    {
      id: 'help',
      keywords: ['help', 'what can you do', 'how does this work', 'instructions', 'guide', 'tutorial'],
      strongKeywords: ['what can you do', 'help me'],
      phrases: ['help me', 'what can you do', 'how does this work', 'what are my options', 'show me options'],
      responses: [
        "I can help you navigate this website! Here's what you can ask me:\n\n• \"Book a visit\" — schedule a caregiver visit\n• \"My care plan\" — view medications and daily schedule\n• \"Find a caregiver\" — browse available caregivers\n• \"Contact support\" — phone numbers and email\n• \"Services\" — see what we offer\n\nJust say or type what you need!"
      ],
      navigate: null,
      navLabel: null
    }
  ];

  // ---- Confused / fallback responses ----
  const confusedResponses = [
    "I'm not quite sure I understood that. Could you try saying it a different way? You can ask me things like 'book a visit' or 'find a caregiver'.",
    "Hmm, I didn't catch that. Try asking me something like 'show my care plan' or 'contact support'. I'm here to help!",
    "I'm sorry, I couldn't understand that request. Here are some things I can help with: booking visits, viewing your care plan, finding caregivers, or contacting support.",
    "I didn't quite get that. Could you try rephrasing? For example, you can say 'I want to book a visit' or 'how do I contact you'."
  ];

  // ---- Tokenize input ----
  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(w => w.length > 0);
  }

  // ---- Score an intent against input ----
  function scoreIntent(intent, input) {
    const lowerInput = input.toLowerCase().trim();
    const tokens = tokenize(input);
    let score = 0;

    // 1. Check exact phrase matches (highest weight)
    for (const phrase of intent.phrases) {
      if (lowerInput.includes(phrase)) {
        score += 10;
        break; // One phrase match is enough
      }
    }

    // 2. Check strong keyword matches (high weight)
    for (const keyword of intent.strongKeywords) {
      if (lowerInput.includes(keyword)) {
        score += 5;
      }
    }

    // 3. Check regular keyword matches (standard weight)
    for (const keyword of intent.keywords) {
      const keyTokens = keyword.split(' ');
      if (keyTokens.length > 1) {
        // Multi-word keyword — check as substring
        if (lowerInput.includes(keyword)) {
          score += 3;
        }
      } else {
        // Single-word keyword — check token match
        if (tokens.includes(keyword)) {
          score += 2;
        }
      }
    }

    // 4. Partial / fuzzy matching (low weight)
    for (const token of tokens) {
      if (token.length < 3) continue;
      for (const keyword of intent.keywords) {
        if (keyword.length < 3) continue;
        // Check if token starts with keyword or keyword starts with token
        if (keyword.startsWith(token) || token.startsWith(keyword)) {
          score += 0.5;
        }
      }
    }

    return score;
  }

  // ---- Main: process user input ----
  function processInput(input) {
    if (!input || input.trim().length === 0) {
      return {
        intent: 'empty',
        response: "I didn't hear anything. Could you try again? You can speak or type your question.",
        navigate: null,
        navLabel: null,
        confidence: 0
      };
    }

    let bestIntent = null;
    let bestScore = 0;

    for (const intent of intents) {
      const score = scoreIntent(intent, input);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    // Confidence threshold
    const CONFIDENCE_THRESHOLD = 2;

    if (bestScore >= CONFIDENCE_THRESHOLD && bestIntent) {
      const responses = bestIntent.responses;
      const response = responses[Math.floor(Math.random() * responses.length)];

      return {
        intent: bestIntent.id,
        response: response,
        navigate: bestIntent.navigate,
        navLabel: bestIntent.navLabel,
        confidence: Math.min(bestScore / 10, 1)
      };
    }

    // Fallback — confused
    return {
      intent: 'confused',
      response: confusedResponses[Math.floor(Math.random() * confusedResponses.length)],
      navigate: null,
      navLabel: null,
      confidence: bestScore / 10
    };
  }

  // ---- Public API ----
  return {
    processInput
  };
})();
