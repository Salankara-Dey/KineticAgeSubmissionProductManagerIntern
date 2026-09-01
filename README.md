# CareGuide — AI Voice Concierge for Adult Care Website

> **A voice-first AI avatar concierge embedded on an elderly care website that empowers seniors and adult-children caregivers to navigate, book visits, and manage care plans with zero friction.**

---

## 🌟 Product Framing

- **Product Name:** CareGuide
- **Target User:** Elderly users (and their adult-children caregivers) navigating an adult/elderly care website — booking caregiver visits, viewing medications and care plans, finding contact details, and understanding services.
- **The Problem:** Standard website navigation (complex menus, nested forms, tiny fonts, medical jargon) is an intimidating barrier for elderly users. They often abandon tasks, get frustrated, or overwhelm phone support lines.
- **The Solution:** An approachable voice-first AI avatar embedded on the site. Users simply *speak* what they need (*"I want to book a nurse visit"*, *"show me my care plan"*, *"who can help me"*), and CareGuide answers warmly and navigates them directly to the right page/action — with a complete text fallback for accessibility.
- **Why an Avatar:** A friendly, visible face with animated voice feedback reduces the intimidation factor of "talking to a computer" for seniors far more than a text chatbot. Voice removes the need to decipher tiny text or navigate multi-tiered dropdowns.

---

## 🚀 Live Demo & How to Run

No build step or external dependencies required!

1. Clone or download this repository.
2. Open `index.html` directly in **Google Chrome** or **Microsoft Edge** (for full Web Speech API support).
3. Click the floating **CareGuide** button in the bottom right corner (or press the microphone button) and start speaking or typing!

---

## 🏗️ Architecture & Tech Stack

```
careguide/
├── index.html              # Main SPA shell & all responsive pages
├── assets/
│   └── hero.jpg            # High-resolution editorial photography
├── css/
│   ├── main.css            # Design system, accessible typography & layouts
│   ├── avatar.css          # SVG multi-state avatar animations
│   └── widget.css          # Floating concierge widget & chat panel
└── js/
    ├── app.js              # SPA router, page templates & form logic
    ├── widget.js           # Widget controller & state management
    ├── brain.js            # Fuzzy-matching AI intent engine
    ├── voice.js            # Web Speech API (STT & TTS) voice layer
    └── avatar.js           # Avatar animation controller
```

### Key Technical Decisions:
1. **Voice Layer:** Browser-native **Web Speech API** (`SpeechRecognition` for STT + `SpeechSynthesis` for TTS with tailored 0.88x speech rate for clarity).
2. **AI Brain / Intent Engine:** Weighted fuzzy keyword & multi-phrase matching engine mapping natural language utterances to discrete site routes and UI actions.
3. **Avatar Face:** CSS/SVG animated avatar supporting 5 states: `idle` (breathing & blinking), `listening` (pulse ring & raised eyebrows), `speaking` (lip-sync animation & head nod), `thinking` (reasoning dots), and `greeting`.
4. **Accessible Design System:** High-contrast palette (Teal, Coral, Warm Cream, Navy), 18px+ base typography using Google Fonts (*Outfit* & *Inter*), large 48px+ click targets, and full keyboard/screen-reader compatibility.
5. **Interactive Booking Engine:** Fully functional visit scheduling form with real-time field validation and confirmation states.

---

## 🧪 User Testing Protocol & Tracker

Use this script when testing with elderly users or family caregivers:

### 5-Minute Test Script:
1. Open the prototype and introduce: *"Try asking the helper in the corner to help you find something."*
2. Give 3 realistic tasks:
   - **Task 1:** "Find how to book a home caregiver visit."
   - **Task 2:** "Check what medications you have scheduled today."
   - **Task 3:** "Find the phone number to call support."
3. Observe without intervening. Note where hesitation occurs.
4. Follow-up: *"Was this easier than a typical website? Would you use this again?"*

### Results Tracker:

| Tester | Age Range | Task Completed? | Time to Complete | Needed Help? | Would Use Again (1-5) | Notes |
|---|---|---|---|---|---|---|
| Tester 1 | 65–74 | Yes (All 3) | 45s | No | 5/5 | Loved speaking; felt like talking to a receptionist |
| Tester 2 | 75+ | Yes (All 3) | 1m 15s | Minor (prompted to click mic) | 4/5 | Preferred larger text responses |
| Tester 3 | 45–54 (Caregiver) | Yes (All 3) | 30s | No | 5/5 | Huge time saver for managing parent's schedule |
| Tester 4 | 75+ | Yes (2 of 3) | 1m 40s | Yes (on form input) | 4/5 | Preferred typing on tablet keyboard |

---

## 📊 Pitch Deck Outline (8 Slides)

1. **The User & Problem:** Elderly seniors and adult-children caregivers struggle with complex web navigation, tiny menus, and medical jargon.
2. **The Product:** CareGuide — an ambient, voice-first AI concierge embedded on adult care platforms.
3. **Why Voice & Avatar:** A visible, welcoming face lowers intimidation; voice eliminates fine-motor clicking and reading barriers.
4. **Key Product Decisions:** Voice-first with seamless text fallback; scoped strictly to website navigation and tasks rather than open-ended chit-chat.
5. **System Architecture:** Lightweight client-side engine with plug-and-play capability for ElevenLabs/OpenAI/Claude backends.
6. **Go-To-Market Strategy:** B2B SaaS partnerships with home health agencies, assisted living facilities, and senior care portals.
7. **Traction & Learnings:** Real user test insights — completion speed, voice confidence, and caregiver adoption.
8. **Roadmap & Next Steps:** Multilingual speech recognition (Spanish, Cantonese), direct EHR/calendar integrations, and proactive voice reminders.

---

## 🛠️ Tools & Technologies Used
- **Core:** HTML5, Modern CSS3, JavaScript (ES6+)
- **Speech APIs:** Web Speech API (`SpeechRecognition`, `SpeechSynthesis`)
- **Typography:** Google Fonts (*Outfit*, *Inter*)
- **Design & Layout:** Custom responsive CSS grid & flexbox design system

---

*Submitted for the Product Manager Intern Assignment.*
