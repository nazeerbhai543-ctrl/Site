/**
 * main.js — Shaik Nazeer | Civil Engineering Portfolio
 * =====================================================
 * Handles all interactive behaviour for the portfolio site:
 *   1. Navbar scroll effects & active-state tracking
 *   2. Smooth scrolling with navbar offset
 *   3. Mobile hamburger menu
 *   4. Scroll-reveal animations
 *   5. Skill-tag tooltips (click-based)
 *   6. Project modal system
 *   7. Contact form validation
 *   8. Hero SVG drawing animation
 *   9. Scroll-to-top button
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────────────────
   * 1. NAVBAR — SCROLL EFFECT + ACTIVE SECTION TRACKING
   * ─────────────────────────────────────────────────────────────────────── */

  const navbar = document.querySelector('.navbar');

  // Add / remove the .scrolled class based on scroll position
  if (navbar) {
    const handleNavbarScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    // Run once on load in case page is already scrolled
    handleNavbarScroll();
  }

  // Intersection Observer — highlight the nav link for the visible section
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  if (navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-72px 0px 0px 0px' // compensate for fixed navbar height
    });

    document.querySelectorAll('.section').forEach(section => {
      sectionObserver.observe(section);
    });
  }


  /* ─────────────────────────────────────────────────────────────────────────
   * 2. SMOOTH SCROLLING
   * ─────────────────────────────────────────────────────────────────────── */

  const NAV_OFFSET = 72; // px — matches the fixed navbar height

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - NAV_OFFSET,
          behavior: 'smooth'
        });
      }

      // Close mobile menu if it happens to be open
      closeMobileMenu();
    });
  });


  /* ─────────────────────────────────────────────────────────────────────────
   * 3. MOBILE HAMBURGER MENU
   * ─────────────────────────────────────────────────────────────────────── */

  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when the semi-transparent overlay behind the menu is clicked
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMobileMenu();
    });
  }

  // Global Escape key handler (shared with modal)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });


  /* ─────────────────────────────────────────────────────────────────────────
   * 4. SCROLL-REVEAL ANIMATIONS
   * ─────────────────────────────────────────────────────────────────────── */

  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ─────────────────────────────────────────────────────────────────────────
   * 5. SKILL TAG TOOLTIPS (click-based)
   * ─────────────────────────────────────────────────────────────────────── */

  const skillDescriptions = {
    'AutoCAD':                        'Used for creating precise 2D drawings including floor plans, elevations, and sections for residential building projects.',
    '2D Floor Plans':                 'Developing skill in laying out rooms, dimensions, openings, and spatial arrangements clearly on paper.',
    'Elevations & Sections':          'Learning to show building facades and internal cuts to communicate design intent.',
    'Architectural Drafting':         'Practicing the production of clear, organized technical drawings used in construction.',
    'Revit':                          'Exploring Revit for BIM-based academic projects involving 3D building modeling.',
    '3D Building Modeling':           'Creating digital three-dimensional representations of building designs.',
    'BIM Fundamentals':               'Understanding how Building Information Modeling integrates design, structure, and data.',
    'Site Supervision':               'Gained exposure to monitoring construction activities during site internship.',
    'Drawing Interpretation':         'Reading and understanding construction drawings during site and drafting work.',
    'Reinforcement & Formwork Inspection': 'Observed rebar placement and shuttering checks during site internship.',
    'Construction Quality Awareness': 'Developing awareness of quality standards on a live construction site.',
    'Quantity Estimation':            'Learning to calculate material quantities from drawings for construction planning.',
    'STAAD.Pro':                      'Being introduced to structural analysis software as part of academic coursework.'
  };

  // Single shared tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'skill-tooltip';
  tooltip.id = 'skill-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    display: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(tooltip);

  /**
   * Position the tooltip above (preferred) or below the clicked tag,
   * clamped to the viewport horizontally.
   * @param {HTMLElement} tag
   */
  function positionTooltip(tag) {
    const rect         = tag.getBoundingClientRect();
    const tooltipWidth = 280;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Clamp to viewport edges
    if (left < 16) left = 16;
    if (left + tooltipWidth > window.innerWidth - 16) {
      left = window.innerWidth - tooltipWidth - 16;
    }

    tooltip.style.maxWidth = tooltipWidth + 'px';
    tooltip.style.left     = left + 'px';

    // Prefer showing above; fall back to below if near the top of the page
    if (rect.top < 120) {
      // Show below the tag
      tooltip.style.top       = (rect.bottom + window.scrollY + 8) + 'px';
      tooltip.style.transform = 'translateY(0)';
    } else {
      // Show above the tag
      tooltip.style.top       = (rect.top + window.scrollY - 8) + 'px';
      tooltip.style.transform = 'translateY(-100%)';
    }
  }

  const skillTags = document.querySelectorAll('.skill-tag');

  skillTags.forEach(tag => {
    tag.addEventListener('click', e => {
      e.stopPropagation();

      const skillName = tag.dataset.skill || tag.textContent.trim();
      const desc      = skillDescriptions[skillName];

      // Clicking an already-active tag hides the tooltip
      if (tag.classList.contains('active')) {
        tag.classList.remove('active');
        tooltip.style.opacity = '0';
        setTimeout(() => {
          if (tooltip.style.opacity === '0') tooltip.style.display = 'none';
        }, 200);
        return;
      }

      // Deactivate any other active tag
      skillTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      if (desc) {
        tooltip.textContent    = desc;
        tooltip.style.display  = 'block';
        tooltip.style.opacity  = '0';
        positionTooltip(tag);
        // Trigger opacity transition after display is applied
        requestAnimationFrame(() => {
          tooltip.style.opacity = '1';
        });
      }
    });
  });

  // Hide tooltip when clicking anywhere else on the page
  document.addEventListener('click', () => {
    skillTags.forEach(t => t.classList.remove('active'));
    tooltip.style.opacity = '0';
    setTimeout(() => {
      if (tooltip.style.opacity === '0') tooltip.style.display = 'none';
    }, 200);
  });


  /* ─────────────────────────────────────────────────────────────────────────
   * 6. PROJECT MODAL SYSTEM
   * ─────────────────────────────────────────────────────────────────────── */

  const projectData = {
    'residential-design': {
      number:       '01',
      category:     'Freelance Design',
      title:        'Residential Building Design',
      description:  'Working on residential building layouts with a focus on space planning, clear dimensions, practical room arrangements, and understandable technical drawings.',
      tools:        ['AutoCAD'],
      contribution: 'Designed complete floor plans, elevations, and section drawings for a residential building, focusing on clear spatial organization and properly dimensioned layouts.',
      learned:      'Improved precision in dimensioning, layer management, and overall drawing clarity. Developed better understanding of how technical drawings communicate building intent.',
      images:       3
    },
    'bim-duplex': {
      number:       '02',
      category:     'Academic Project',
      title:        'BIM-Based Duplex House',
      description:  'An academic project focused on exploring BIM workflows and creating a digital representation of a duplex building.',
      tools:        ['Revit'],
      contribution: 'Created 3D building model and extracted architectural plan views. Organized model by disciplines and building levels.',
      learned:      "Understood how BIM coordinates multiple building disciplines. Gained experience with Revit's model structure, view creation, and family usage.",
      images:       2
    },
    'earthen-dam': {
      number:       '03',
      category:     'Academic Project',
      title:        'Earthen Dam Simulation',
      description:  'An academic project exploring seepage flow, piping, and internal erosion concepts in an earthen dam.',
      tools:        ['Academic simulation tools'],
      contribution: 'Studied seepage behavior through the dam body and presented simulation findings. Analyzed failure mechanisms related to internal erosion.',
      learned:      'Understood geotechnical concepts of dam safety, seepage flow paths, and the importance of internal drainage design in earthen structures.',
      images:       2
    }
  };

  /**
   * Build the inner HTML for the project modal.
   * @param {Object} data — entry from projectData
   * @returns {string} HTML string
   */
  function buildModalContent(data) {
    const imagesHTML = Array.from({ length: data.images }, (_, i) => `
      <div class="modal-image-slot">
        <span style="font-size:1.5rem;margin-bottom:0.5rem;">📁</span>
        <span>Project Image ${i + 1}</span>
        <span style="font-weight:400;color:#C8C4BC;margin-top:0.25rem;">Placeholder — Replace with actual image</span>
      </div>
    `).join('');

    const toolsHTML = data.tools
      .map(t => `<span class="tool-tag" style="font-size:0.85rem;padding:0.375rem 0.875rem;">${t}</span>`)
      .join('');

    const isAcademic = data.category === 'Academic Project';

    return `
      <div class="modal-header">
        <div>
          <div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:0.75rem;">
            <span class="project-category-badge${isAcademic ? ' academic' : ''}">${data.category}</span>
            <span style="font-size:0.8rem;color:#A8B5A0;font-weight:600;">${data.number}</span>
          </div>
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.75rem;font-weight:700;color:#1A2820;margin:0;">
            ${data.title}
          </h2>
        </div>
        <button class="modal-close" id="modal-close-btn" aria-label="Close modal">✕</button>
      </div>

      <div class="modal-visual-grid">
        ${imagesHTML}
      </div>

      <div class="modal-section">
        <div class="modal-section-title">About This Project</div>
        <div class="modal-section-content">${data.description}</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Tools Used</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;">${toolsHTML}</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">My Contribution</div>
        <div class="modal-section-content">${data.contribution}</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">What I Learned</div>
        <div class="modal-section-content">${data.learned}</div>
      </div>
    `;
  }

  const modalOverlay = document.getElementById('project-modal');
  const modalBox     = document.getElementById('modal-box');

  /**
   * Open the project modal and populate it with the given project's data.
   * @param {string} projectId — key in projectData
   */
  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modalOverlay || !modalBox) return;

    modalBox.innerHTML = buildModalContent(data);
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Bind close button (recreated each time modal opens)
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open modal when a project card is clicked
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
  });

  // Close when clicking the dark overlay (not the modal box itself)
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Escape key also closes the modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });


  /* ─────────────────────────────────────────────────────────────────────────
   * 7. CONTACT FORM VALIDATION
   * ─────────────────────────────────────────────────────────────────────── */

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      const nameField    = contactForm.querySelector('[name="name"]');
      const emailField   = contactForm.querySelector('[name="email"]');
      const messageField = contactForm.querySelector('[name="message"]');

      const name    = nameField    ? nameField.value.trim()    : '';
      const email   = emailField   ? emailField.value.trim()   : '';
      const message = messageField ? messageField.value.trim() : '';

      if (!name || !email || !message) {
        e.preventDefault();
        showFormMessage('Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        e.preventDefault();
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Valid — let the mailto action proceed
      showFormMessage('Opening your email client…', 'success');
    });
  }

  /**
   * Basic email format check.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Display an inline status message below the contact form.
   * @param {string} msg
   * @param {'error'|'success'} type
   */
  function showFormMessage(msg, type) {
    if (!contactForm) return;

    let msgEl = document.getElementById('form-message');
    if (!msgEl) {
      msgEl    = document.createElement('div');
      msgEl.id = 'form-message';
      contactForm.appendChild(msgEl);
    }

    msgEl.textContent = msg;
    msgEl.style.cssText = `
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      text-align: center;
      background: ${type === 'error' ? 'rgba(220,53,69,0.15)' : 'rgba(168,181,160,0.2)'};
      color: ${type === 'error' ? '#ff6b6b' : '#A8B5A0'};
      border: 1px solid ${type === 'error' ? 'rgba(220,53,69,0.3)' : 'rgba(168,181,160,0.3)'};
    `;
  }


  /* ─────────────────────────────────────────────────────────────────────────
   * 8. HERO DRAWING ANIMATION
   * Cycles the .active-room highlight through SVG rooms every 2 seconds
   * ─────────────────────────────────────────────────────────────────────── */

  const rooms = document.querySelectorAll('.highlight-room');

  if (rooms.length > 0) {
    let currentRoom = 0;

    setInterval(() => {
      rooms.forEach(r => r.classList.remove('active-room'));
      rooms[currentRoom % rooms.length].classList.add('active-room');
      currentRoom++;
    }, 2000);
  }


  /* ─────────────────────────────────────────────────────────────────────────
   * 9. SCROLL-TO-TOP BUTTON
   * ─────────────────────────────────────────────────────────────────────── */

  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 999;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: #263B32;
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(38,59,50,0.3);
    transition: all 0.25s ease;
  `;
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

}); // end DOMContentLoaded
