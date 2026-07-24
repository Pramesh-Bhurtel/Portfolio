import { $, $$ } from './dom.js';

const LS_PROJECTS = 'cms_projects';
const LS_CONFIG   = 'cms_config';

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * Used before inserting any user-controlled content into innerHTML.
 * @param {*} value
 * @returns {string} safe escaped string
 */
function escHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates a URL — ensures it's HTTP/HTTPS only.
 * Blocks javascript: and data: protocol injection in link hrefs and img src.
 * @param {string} url
 * @returns {string} safe URL or empty string
 */
function safeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return '';
  return trimmed;
}

/**
 * initCmsSync — Portfolio Page Hydration Module
 *
 * Reads CMS data from localStorage (with optional Firebase real-time binding)
 * and hydrates the live portfolio page (hero, skills, projects grid).
 *
 * Firebase listener is lazy-loaded only if Firebase is configured,
 * so general page-load performance is never impacted.
 */
export async function initCmsSync() {
  // Immediate hydration from localStorage (zero-latency on page load)
  const projectsRaw = localStorage.getItem(LS_PROJECTS);
  const configRaw   = localStorage.getItem(LS_CONFIG);

  try { if (configRaw)   applyConfig(JSON.parse(configRaw)); } catch {}
  try { if (projectsRaw) applyProjects(JSON.parse(projectsRaw)); } catch {}

  // Attempt Firebase real-time upgrade (lazy, non-blocking)
  try {
    const { initFirebase } = await import('./firebase.js');
    const { db } = await initFirebase();

    if (db) {
      const { ref, onValue } = await import(
        'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js'
      );

      // Live-bind projects node — portfolio updates for ALL visitors instantly
      onValue(ref(db, 'portfolio/projects'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const arr  = Array.isArray(data) ? data : Object.values(data);
          localStorage.setItem(LS_PROJECTS, JSON.stringify(arr));
          applyProjects(arr);
        }
      });

      // Live-bind config node
      onValue(ref(db, 'portfolio/config'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          localStorage.setItem(LS_CONFIG, JSON.stringify(data));
          applyConfig(data);
        }
      });
    }
  } catch {
    // Firebase unavailable — localStorage hydration already applied above
    console.info('[CmsSync] Running in offline mode (localStorage only).');
  }
}

// ── DOM Hydration Helpers ───────────────────────────────────────────

function applyConfig(config) {
  if (!config) return;

  const {
    heroGreeting, heroTitle, heroBio, skills,
    contactEmail, contactPhone, contactLocation,
    facebookUrl, instagramUrl, githubUrl, linkedinUrl
  } = config;

  // Use textContent for all text fields — never innerHTML with user data
  const greetingEl = $('.greeting');
  if (greetingEl && heroGreeting) greetingEl.textContent = heroGreeting;

  const heroQuoteEl = $('.hero-quote');
  if (heroQuoteEl && heroTitle) heroQuoteEl.textContent = heroTitle;

  const aboutEl = $('.about-text p');
  if (aboutEl && heroBio) aboutEl.textContent = heroBio;

  if (Array.isArray(skills) && skills.length) {
    const skillsGrid = $('.skills-grid');
    if (skillsGrid) {
      // Escape each skill tag to prevent XSS via admin-injected skill names
      skillsGrid.innerHTML = skills
        .map(s => `<span class="skill-tag">${escHtml(s)}</span>`)
        .join('');
    }
  }

  // Update Contact Details — use textContent for display, safe href for links
  if (contactEmail) {
    const emailLink = document.querySelector('a.contact-link[href^="mailto:"]');
    if (emailLink) {
      emailLink.href = `mailto:${encodeURIComponent(contactEmail)}`;
      emailLink.textContent = contactEmail;
    }
  }

  if (contactPhone) {
    const phoneLink = document.querySelector('a.contact-link[href^="tel:"]');
    if (phoneLink) {
      phoneLink.href = `tel:${contactPhone.replace(/\s+/g, '')}`;
      phoneLink.textContent = contactPhone;
    }
  }

  if (contactLocation) {
    const locationEl = document.querySelector('a.contact-link[href*="maps"]');
    if (locationEl) locationEl.textContent = contactLocation;
  }

  // Update Social Media Links — validate before setting href
  const socials = [
    ['.social-links a[aria-label="Facebook"]',  facebookUrl],
    ['.social-links a[aria-label="Instagram"]', instagramUrl],
    ['.social-links a[aria-label="GitHub"]',    githubUrl],
    ['.social-links a[aria-label="LinkedIn"]',  linkedinUrl],
  ];
  socials.forEach(([selector, url]) => {
    const el = document.querySelector(selector);
    const safe = safeUrl(url);
    if (el && safe) el.href = safe;
  });
}

function applyProjects(projects) {
  if (!Array.isArray(projects) || !projects.length) return;

  const grid = $('.projects-grid');
  if (!grid) return;

  // Use DocumentFragment to batch all DOM insertions — minimizes reflows
  const frag = document.createDocumentFragment();

  projects.forEach(project => {
    const article = document.createElement('article');
    article.className = 'project-card revealed';

    const links    = buildLinks(project);
    const techTags = (project.tech || [])
      .map(t => `<span>${escHtml(t)}</span>`)
      .join('');

    // Sanitize all user-supplied values before inserting into HTML
    const imgSrc = safeUrl(project.image) || '';

    // Build card DOM via innerHTML with all values properly escaped
    article.innerHTML = `
      <div class="project-image">
        <img src="${escHtml(imgSrc)}" alt="${escHtml(project.title)}"
             width="600" height="400" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23171717%22 width=%22100%22 height=%22100%22/><text fill=%22%23e11d48%22 font-size=%2212%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>No Image</text></svg>'">
      </div>
      <div class="project-content">
        <h3>${escHtml(project.title)}</h3>
        <p>${escHtml(project.desc)}</p>
        <div class="project-tech">${techTags}</div>
        <div class="project-links">${links}</div>
      </div>
    `;

    frag.appendChild(article);
  });

  grid.innerHTML = '';
  grid.appendChild(frag);
}

function buildLinks(project) {
  const links = [];

  const add = (url, label) => {
    const safe = safeUrl(url);
    if (safe) {
      links.push(
        `<a href="${escHtml(safe)}" class="project-link" target="_blank" rel="noopener noreferrer">${escHtml(label)}</a>`
      );
    }
  };

  // Preset platform links
  add(project.githubUrl,    'Source Code');
  add(project.facebookUrl,  'Facebook');
  add(project.instagramUrl, 'Instagram');
  add(project.tiktokUrl,    'TikTok');
  add(project.youtubeUrl,   'YouTube');

  // Multiple Custom Action Buttons (array of { label, url })
  if (Array.isArray(project.customLinks) && project.customLinks.length > 0) {
    project.customLinks.forEach(link => {
      if (link.label && link.url) add(link.url, link.label);
    });
  } else {
    // Legacy fallback
    if (project.customLabel && project.customUrl) add(project.customUrl, project.customLabel);
    if (project.demoUrl) add(project.demoUrl, 'Live Demo');
  }

  return links.join('');
}
