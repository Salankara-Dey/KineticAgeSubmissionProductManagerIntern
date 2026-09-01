/**
 * CareGuide SPA Router & Page Renderer
 * ========================================
 * Hash-based single-page app with smooth transitions
 * and full page content for Sunrise Senior Care.
 */

const CareGuideApp = (() => {
  let mainContent = null;
  let currentRoute = '';

  // ---- Route definitions ----
  const routes = {
    '/': renderHome,
    '/book': renderBook,
    '/care-plan': renderCarePlan,
    '/caregivers': renderCaregivers,
    '/contact': renderContact,
    '/services': renderServices
  };

  // ---- Initialize ----
  function init() {
    mainContent = document.getElementById('main-content');

    // Header scroll effect
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });

    // Mobile menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('site-nav');
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuBtn.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    // Close mobile menu on nav click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.textContent = '☰';
      });
    });

    // Listen for route changes
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  // ---- Handle route ----
  function handleRoute() {
    const hash = window.location.hash || '#/';
    const route = hash.replace('#', '') || '/';
    currentRoute = route;

    const renderer = routes[route] || renderHome;

    // Update active nav
    document.querySelectorAll('.site-nav a').forEach(link => {
      const page = link.getAttribute('data-page');
      const isActive =
        (route === '/' && page === 'home') ||
        (route === `/${page}`);
      link.classList.toggle('active', isActive);
    });

    // Render with transition
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(10px)';

    setTimeout(() => {
      mainContent.innerHTML = renderer();
      mainContent.classList.remove('page-content');
      void mainContent.offsetWidth; // Force reflow
      mainContent.classList.add('page-content');
      mainContent.style.opacity = '1';
      mainContent.style.transform = 'translateY(0)';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      attachPageHandlers(route);
    }, 200);
  }

  // ---- Navigate programmatically (used by widget) ----
  function navigateTo(hash) {
    window.location.hash = hash;
  }

  // ---- Attach page-specific handlers ----
  function attachPageHandlers(route) {
    if (route === '/book') {
      attachBookingFormHandlers();
    }
    if (route === '/services') {
      attachFAQHandlers();
    }
  }

  // ========================================================
  // PAGE RENDERERS
  // ========================================================

  // ---- HOME PAGE ----
  function renderHome() {
    return `
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-badge">🌟 Trusted by 2,000+ families</div>
            <h1>Quality Care,<br><span class="highlight">Right at Home</span></h1>
            <p>Compassionate, personalized in-home care for your loved ones. Book visits, manage care plans, and connect with trusted caregivers — all in one place.</p>
            <div class="hero-buttons">
              <a href="#/book" class="btn btn--primary btn--lg">Book a Visit</a>
              <a href="#/services" class="btn btn--outline btn--lg">Our Services</a>
            </div>
            <div class="hero-stats">
              <div class="hero-stat">
                <div class="number">2,000+</div>
                <div class="label">Families Served</div>
              </div>
              <div class="hero-stat">
                <div class="number">150+</div>
                <div class="label">Caregivers</div>
              </div>
              <div class="hero-stat">
                <div class="number">4.9★</div>
                <div class="label">Average Rating</div>
              </div>
            </div>
          </div>
          <div class="hero-image">
            <img src="assets/hero.jpg" alt="A caregiver helping an elderly woman in a warm, sunlit living room" loading="eager">
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>How Can We Help You Today?</h2>
            <p>Quick access to everything you need. Click any card or just ask CareGuide!</p>
          </div>
          <div class="grid-4">
            <a href="#/book" class="card action-card">
              <div class="card-icon card-icon--teal">📅</div>
              <h4>Book a Visit</h4>
              <p>Schedule a caregiver visit at a time that works for you.</p>
              <span class="card-link">Schedule now</span>
            </a>
            <a href="#/care-plan" class="card action-card">
              <div class="card-icon card-icon--coral">📋</div>
              <h4>My Care Plan</h4>
              <p>View your medications, daily schedule, and caregiver notes.</p>
              <span class="card-link">View plan</span>
            </a>
            <a href="#/caregivers" class="card action-card">
              <div class="card-icon card-icon--gold">👤</div>
              <h4>Find a Caregiver</h4>
              <p>Browse profiles of our trusted, experienced caregivers.</p>
              <span class="card-link">Browse caregivers</span>
            </a>
            <a href="#/contact" class="card action-card">
              <div class="card-icon card-icon--navy">📞</div>
              <h4>Contact Support</h4>
              <p>Call us, email us, or send a message. We're here to help.</p>
              <span class="card-link">Get in touch</span>
            </a>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="section section--cream">
        <div class="container">
          <div class="section-header">
            <h2>Getting Started is Easy</h2>
            <p>Three simple steps to quality care at home.</p>
          </div>
          <div class="steps">
            <div class="step">
              <h4>Tell Us What You Need</h4>
              <p>Book a visit or call us — we'll understand your care needs and preferences.</p>
            </div>
            <div class="step">
              <h4>Meet Your Caregiver</h4>
              <p>We'll match you with a trained, compassionate caregiver who fits your family.</p>
            </div>
            <div class="step">
              <h4>Enjoy Peace of Mind</h4>
              <p>Regular visits, transparent care plans, and 24/7 support. You're never alone.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>What Families Say</h2>
            <p>Real stories from families who trust Sunrise Senior Care.</p>
          </div>
          <div class="grid-3">
            <div class="testimonial-card">
              <p class="testimonial-text">The caregiver they matched with my mother has been absolutely wonderful. Mom looks forward to her visits every week. It's given our whole family peace of mind.</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar" style="background: linear-gradient(135deg, #2A9D8F, #48BFB3);">SK</div>
                <div>
                  <div class="testimonial-name">Sarah K.</div>
                  <div class="testimonial-role">Daughter of patient</div>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <p class="testimonial-text">I was nervous about having someone new in my home, but my caregiver from Sunrise felt like family from day one. Very professional and genuinely caring.</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar" style="background: linear-gradient(135deg, #E76F51, #F4A261);">RM</div>
                <div>
                  <div class="testimonial-name">Robert M.</div>
                  <div class="testimonial-role">Patient, age 78</div>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <p class="testimonial-text">The online care plan makes it so easy to track Dad's medications and appointments. And the CareGuide helper on the website is a game changer for him!</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar" style="background: linear-gradient(135deg, #E9C46A, #F4A261);">JT</div>
                <div>
                  <div class="testimonial-name">Jennifer T.</div>
                  <div class="testimonial-role">Daughter of patient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section section--navy">
        <div class="container" style="text-align: center;">
          <h2>Ready to Get Started?</h2>
          <p style="max-width: 500px; margin: 16px auto 32px;">Your loved ones deserve compassionate, professional care. Book a visit today or call us to learn more.</p>
          <div class="hero-buttons" style="justify-content: center;">
            <a href="#/book" class="btn btn--secondary btn--lg">Book a Visit</a>
            <a href="#/contact" class="btn btn--outline btn--lg" style="border-color: rgba(255,255,255,0.4); color: white;">Contact Us</a>
          </div>
        </div>
      </section>
    `;
  }

  // ---- BOOK A VISIT PAGE ----
  function renderBook() {
    return `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span> <span>Book a Visit</span>
          </div>
          <h1>📅 Book a Visit</h1>
          <p>Schedule a caregiver visit in just a few simple steps. Pick a date, choose the type of care, and we'll handle the rest.</p>
        </div>
      </div>

      <section class="section">
        <div class="container container--narrow">
          <div id="booking-form-container">
            <div class="card" style="padding: 40px;">
              <h3 style="margin-bottom: 24px;">Schedule Your Visit</h3>

              <form id="booking-form" novalidate>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="visit-date">Preferred Date</label>
                    <input type="date" class="form-input" id="visit-date" required>
                    <div class="form-error">Please select a date.</div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="visit-time">Preferred Time</label>
                    <select class="form-select" id="visit-time" required>
                      <option value="">Select a time...</option>
                      <option value="morning">Morning (8 AM – 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM – 4 PM)</option>
                      <option value="evening">Evening (4 PM – 8 PM)</option>
                    </select>
                    <div class="form-error">Please select a time.</div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="visit-type">Type of Visit</label>
                  <select class="form-select" id="visit-type" required>
                    <option value="">What kind of care do you need?</option>
                    <option value="nursing">Home Nursing</option>
                    <option value="companion">Companion Care</option>
                    <option value="therapy">Physical Therapy</option>
                    <option value="personal">Personal Care (bathing, grooming)</option>
                    <option value="checkup">General Health Check-up</option>
                  </select>
                  <div class="form-error">Please select a visit type.</div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="visit-caregiver">Preferred Caregiver (optional)</label>
                  <select class="form-select" id="visit-caregiver">
                    <option value="">No preference — match me with the best fit</option>
                    <option value="maria">Maria Santos — Home Nursing</option>
                    <option value="james">James Wilson — Physical Therapy</option>
                    <option value="priya">Priya Patel — Companion Care</option>
                    <option value="david">David Chen — Personal Care</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="visit-notes">Special Notes or Requests</label>
                  <textarea class="form-textarea" id="visit-notes" placeholder="Anything we should know? Allergies, mobility needs, preferences..."></textarea>
                  <div class="form-hint">Optional — helps us prepare for your visit.</div>
                </div>

                <button type="submit" class="btn btn--primary btn--lg btn--full" id="booking-submit-btn">
                  Confirm Booking
                </button>
              </form>
            </div>

            <div class="card" style="padding: 24px; margin-top: 24px; background: var(--color-cream);">
              <h4 style="margin-bottom: 12px;">💡 What to Expect</h4>
              <ul style="color: var(--color-text-light); line-height: 1.8; padding-left: 20px; list-style: disc;">
                <li>You'll receive a confirmation call within 2 hours</li>
                <li>Your caregiver will arrive within the selected time window</li>
                <li>First visits typically last 1–2 hours</li>
                <li>You can reschedule or cancel up to 24 hours before</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ---- CARE PLAN PAGE ----
  function renderCarePlan() {
    return `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span> <span>My Care Plan</span>
          </div>
          <h1>📋 My Care Plan</h1>
          <p>Your personalized care overview — medications, daily schedule, and caregiver notes.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <!-- Patient Info -->
          <div class="care-plan-header">
            <div class="patient-avatar">EM</div>
            <div class="patient-info">
              <h3>Eleanor Mitchell</h3>
              <div class="patient-meta">
                <span>📅 DOB: March 15, 1948</span>
                <span>🏠 Springfield, IL</span>
                <span>👤 Primary: Dr. Sarah Johnson</span>
              </div>
              <div style="margin-top: 8px;">
                <span class="badge badge--success">Active Care Plan</span>
                <span class="badge badge--primary" style="margin-left: 8px;">Last Updated: Aug 28, 2026</span>
              </div>
            </div>
          </div>

          <div class="grid-2" style="align-items: start;">
            <div>
              <!-- Medications -->
              <div class="care-section">
                <h3>💊 Medications</h3>
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Lisinopril</strong></td>
                      <td>10mg</td>
                      <td>Once daily (morning)</td>
                    </tr>
                    <tr>
                      <td><strong>Metformin</strong></td>
                      <td>500mg</td>
                      <td>Twice daily (with meals)</td>
                    </tr>
                    <tr>
                      <td><strong>Vitamin D3</strong></td>
                      <td>2000 IU</td>
                      <td>Once daily (morning)</td>
                    </tr>
                    <tr>
                      <td><strong>Aspirin</strong></td>
                      <td>81mg</td>
                      <td>Once daily (evening)</td>
                    </tr>
                    <tr>
                      <td><strong>Calcium</strong></td>
                      <td>600mg</td>
                      <td>Once daily (with dinner)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Notes -->
              <div class="care-section">
                <h3>📝 Caregiver Notes</h3>
                <div style="padding: 16px; background: var(--color-cream); border-radius: 12px; line-height: 1.7; color: var(--color-text-light);">
                  <p><strong>Aug 28:</strong> Eleanor had a great day today. She enjoyed the garden walk and completed all exercises. Blood pressure: 128/82. Appetite is good — ate full lunch and dinner.</p>
                  <p style="margin-top: 12px;"><strong>Aug 25:</strong> Mild knee stiffness noted during morning routine. Applied warm compress. Suggested follow-up with Dr. Johnson if it persists. Otherwise in good spirits.</p>
                  <p style="margin-top: 12px;"><strong>Aug 22:</strong> Family visit from daughter Sarah and grandchildren. Eleanor was very happy and energetic. Completed physical therapy exercises without assistance.</p>
                </div>
              </div>
            </div>

            <div>
              <!-- Daily Schedule -->
              <div class="care-section">
                <h3>🕐 Daily Schedule</h3>
                <div class="schedule-item">
                  <div class="schedule-time">7:00 AM</div>
                  <div class="schedule-activity">Wake up, morning hygiene routine</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">7:30 AM</div>
                  <div class="schedule-activity">Morning medications with breakfast</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">9:00 AM</div>
                  <div class="schedule-activity">Light exercise / physical therapy</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">10:30 AM</div>
                  <div class="schedule-activity">Social time / hobbies / garden walk</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">12:00 PM</div>
                  <div class="schedule-activity">Lunch + afternoon medications</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">1:30 PM</div>
                  <div class="schedule-activity">Rest / nap time</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">3:00 PM</div>
                  <div class="schedule-activity">Afternoon activity / reading / visitors</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">5:30 PM</div>
                  <div class="schedule-activity">Dinner + evening medications</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">7:00 PM</div>
                  <div class="schedule-activity">Evening relaxation / TV / family call</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">9:00 PM</div>
                  <div class="schedule-activity">Bedtime routine</div>
                </div>
              </div>

              <!-- Emergency Contacts -->
              <div class="care-section" style="border: 2px solid #E53E3E22;">
                <h3>🚨 Emergency Contacts</h3>
                <div class="schedule-item">
                  <div class="schedule-time" style="color: var(--color-danger);">911</div>
                  <div class="schedule-activity"><strong>Emergency Services</strong></div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">Dr. Johnson</div>
                  <div class="schedule-activity">(555) 111-2233 — Primary Physician</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">Sarah K.</div>
                  <div class="schedule-activity">(555) 444-5566 — Daughter</div>
                </div>
                <div class="schedule-item">
                  <div class="schedule-time">Sunrise</div>
                  <div class="schedule-activity">(555) 234-5678 — 24/7 Care Line</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ---- FIND A CAREGIVER PAGE ----
  function renderCaregivers() {
    const caregivers = [
      {
        name: 'Maria Santos',
        specialty: 'Home Nursing • RN Certified',
        rating: 4.9,
        reviews: 127,
        tags: ['Wound Care', 'Diabetes Management', 'Post-Surgery'],
        available: true,
        color: '#2A9D8F',
        initials: 'MS',
        experience: '12 years experience'
      },
      {
        name: 'James Wilson',
        specialty: 'Physical Therapy • Licensed PT',
        rating: 4.8,
        reviews: 93,
        tags: ['Mobility Training', 'Fall Prevention', 'Pain Management'],
        available: true,
        color: '#E76F51',
        initials: 'JW',
        experience: '8 years experience'
      },
      {
        name: 'Priya Patel',
        specialty: 'Companion Care • Certified Aide',
        rating: 5.0,
        reviews: 64,
        tags: ['Social Engagement', 'Meal Preparation', 'Light Housekeeping'],
        available: true,
        color: '#E9C46A',
        initials: 'PP',
        experience: '6 years experience'
      },
      {
        name: 'David Chen',
        specialty: 'Personal Care • CNA',
        rating: 4.7,
        reviews: 85,
        tags: ['Bathing Assistance', 'Grooming', 'Medication Reminders'],
        available: false,
        color: '#264653',
        initials: 'DC',
        experience: '10 years experience'
      }
    ];

    const stars = (rating) => {
      const full = Math.floor(rating);
      const half = rating % 1 >= 0.5 ? 1 : 0;
      return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
    };

    return `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span> <span>Find a Caregiver</span>
          </div>
          <h1>👤 Find a Caregiver</h1>
          <p>Browse our team of trusted, experienced caregivers. Each one is background-checked and specially trained.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="grid-4">
            ${caregivers.map(cg => `
              <div class="caregiver-card">
                <div class="caregiver-avatar-placeholder" style="background: linear-gradient(135deg, ${cg.color}, ${cg.color}88);">
                  ${cg.initials}
                </div>
                <div class="caregiver-info">
                  <div class="caregiver-name">${cg.name}</div>
                  <div class="caregiver-specialty">${cg.specialty}</div>
                  <div class="caregiver-rating">
                    <span class="stars">${stars(cg.rating)}</span>
                    <span class="count">${cg.rating} (${cg.reviews} reviews)</span>
                  </div>
                  <div style="font-size: 14px; color: var(--color-text-lighter); margin-bottom: 12px;">${cg.experience}</div>
                  <div class="caregiver-tags">
                    ${cg.tags.map(tag => `<span class="caregiver-tag">${tag}</span>`).join('')}
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span class="badge ${cg.available ? 'badge--success' : 'badge--warning'}">
                      ${cg.available ? '✓ Available' : '⏳ Booked this week'}
                    </span>
                    ${cg.available ? `<a href="#/book" class="btn btn--primary" style="padding: 8px 16px; font-size: 14px; min-height: 36px;">Book</a>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin-top: 48px;">
            <p style="font-size: 18px; margin-bottom: 16px;">Don't see the right fit? We have over 150 caregivers in our network.</p>
            <a href="#/contact" class="btn btn--outline">Contact Us for a Custom Match</a>
          </div>
        </div>
      </section>
    `;
  }

  // ---- CONTACT PAGE ----
  function renderContact() {
    return `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span> <span>Contact Support</span>
          </div>
          <h1>📞 Contact Support</h1>
          <p>We're here for you. Reach out anytime — by phone, email, or the form below.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <!-- Emergency banner -->
          <div class="emergency-banner">
            🚨 For medical emergencies, always call <a href="tel:911">911</a> first. For urgent care questions: <a href="tel:+15552345678">(555) 234-5678</a>
          </div>

          <!-- Contact methods -->
          <div class="contact-grid">
            <div class="contact-card">
              <div class="icon">📞</div>
              <h4>Phone</h4>
              <p style="margin-bottom: 12px; color: var(--color-text-lighter);">Mon–Sat, 7 AM – 8 PM</p>
              <div class="value"><a href="tel:+15552345678">(555) 234-5678</a></div>
            </div>
            <div class="contact-card">
              <div class="icon">✉️</div>
              <h4>Email</h4>
              <p style="margin-bottom: 12px; color: var(--color-text-lighter);">We reply within 4 hours</p>
              <div class="value"><a href="mailto:care@sunrisesenior.com">care@sunrisesenior.com</a></div>
            </div>
            <div class="contact-card">
              <div class="icon">📍</div>
              <h4>Visit Us</h4>
              <p style="margin-bottom: 12px; color: var(--color-text-lighter);">Walk-ins welcome</p>
              <div class="value" style="font-size: 16px;">123 Maple Lane, Springfield</div>
            </div>
          </div>

          <!-- Contact form -->
          <div class="card" style="max-width: 700px; margin: 0 auto; padding: 40px;">
            <h3 style="margin-bottom: 24px;">Send Us a Message</h3>
            <form id="contact-form" onsubmit="return false;">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="contact-name">Your Name</label>
                  <input type="text" class="form-input" id="contact-name" placeholder="Full name">
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-phone">Phone Number</label>
                  <input type="tel" class="form-input" id="contact-phone" placeholder="(555) 000-0000">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-email">Email</label>
                <input type="email" class="form-input" id="contact-email" placeholder="you@email.com">
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-message">Message</label>
                <textarea class="form-textarea" id="contact-message" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--lg btn--full">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  // ---- SERVICES & FAQ PAGE ----
  function renderServices() {
    const faqs = [
      {
        q: 'What types of care do you provide?',
        a: 'We offer home nursing, companion care, physical therapy, personal care (bathing, grooming), medication management, and specialized dementia/Alzheimer\'s care. All services are customizable to your needs.'
      },
      {
        q: 'How are caregivers screened and trained?',
        a: 'Every caregiver goes through a comprehensive background check, skills assessment, and training program. They are certified, insured, and receive ongoing education. We only accept the top 5% of applicants.'
      },
      {
        q: 'Does insurance cover your services?',
        a: 'Many of our services are covered by Medicare, Medicaid, and most private insurance plans. We also offer flexible payment plans. Contact us for a free coverage check — we\'ll help you understand your options.'
      },
      {
        q: 'Can I choose my caregiver?',
        a: 'Absolutely! You can browse caregiver profiles, read reviews, and request specific caregivers. We also offer a matching service to find the best fit based on your needs and preferences.'
      },
      {
        q: 'What if I need to cancel or reschedule?',
        a: 'You can cancel or reschedule up to 24 hours before your visit at no charge. For same-day changes, please call us directly and we\'ll do our best to accommodate.'
      },
      {
        q: 'Do you provide 24/7 or live-in care?',
        a: 'Yes! In addition to scheduled visits, we offer 24-hour care and live-in caregiver options for those who need continuous support. Contact us to discuss your needs and pricing.'
      }
    ];

    return `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span> <span>Services & FAQs</span>
          </div>
          <h1>🏥 Our Services</h1>
          <p>Comprehensive care solutions tailored to every family's needs.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="grid-3">
            <div class="service-card">
              <div class="service-icon">🏥</div>
              <h4>Home Nursing</h4>
              <p>Professional RN care at home — wound care, IV management, health monitoring, and post-surgery recovery.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🤝</div>
              <h4>Companion Care</h4>
              <p>Friendly companionship, social engagement, meal preparation, light housekeeping, and errand assistance.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🏃</div>
              <h4>Physical Therapy</h4>
              <p>In-home physical therapy for mobility improvement, fall prevention, pain management, and rehabilitation.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🛁</div>
              <h4>Personal Care</h4>
              <p>Dignified assistance with bathing, grooming, dressing, toileting, and daily personal hygiene needs.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">💊</div>
              <h4>Medication Management</h4>
              <p>Ensuring medications are taken correctly and on time. Includes refill coordination and doctor communication.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🧠</div>
              <h4>Memory Care</h4>
              <p>Specialized care for dementia and Alzheimer's patients — cognitive activities, safety supervision, and family support.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--cream">
        <div class="container">
          <div class="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We've got answers.</p>
          </div>
          <div class="faq-list">
            ${faqs.map((faq, i) => `
              <div class="faq-item" id="faq-${i}">
                <button class="faq-question" aria-expanded="false">
                  <span>${faq.q}</span>
                  <span class="faq-toggle">+</span>
                </button>
                <div class="faq-answer">
                  <div class="faq-answer-inner">${faq.a}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container" style="text-align: center;">
          <h2>Still Have Questions?</h2>
          <p style="max-width: 500px; margin: 16px auto 32px;">We're happy to help! Reach out to our care team for personalized assistance.</p>
          <a href="#/contact" class="btn btn--primary btn--lg">Contact Our Team</a>
        </div>
      </section>
    `;
  }

  // ========================================================
  // PAGE HANDLERS
  // ========================================================

  // ---- Booking Form ----
  function attachBookingFormHandlers() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    // Set min date to today
    const dateInput = document.getElementById('visit-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value) {
          group.classList.add('error');
          valid = false;
        } else {
          group.classList.remove('error');
        }
      });

      if (!valid) return;

      // Show success
      const container = document.getElementById('booking-form-container');
      container.innerHTML = `
        <div class="success-message">
          <div class="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p style="font-size: 18px; margin-bottom: 24px;">Your visit has been scheduled. We'll call you within 2 hours to confirm the details.</p>
          <div class="card" style="text-align: left; padding: 24px; max-width: 400px; margin: 0 auto 24px;">
            <p><strong>Date:</strong> ${dateInput.value}</p>
            <p><strong>Time:</strong> ${document.getElementById('visit-time').value}</p>
            <p><strong>Type:</strong> ${document.getElementById('visit-type').value}</p>
          </div>
          <a href="#/" class="btn btn--primary">Back to Home</a>
        </div>
      `;
    });
  }

  // ---- FAQ Accordion ----
  function attachFAQHandlers() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const btn = item.querySelector('.faq-question');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all others
        items.forEach(other => other.classList.remove('open'));
        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---- Public API ----
  return {
    init,
    navigateTo
  };
})();
