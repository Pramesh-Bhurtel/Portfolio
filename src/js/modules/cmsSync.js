import { $, $$ } from './dom.js';

const LS_PROJECTS = 'cms_projects';
const LS_CONFIG   = 'cms_config';

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

  if (configRaw)   applyConfig(JSON.parse(configRaw));
  if (projectsRaw) applyProjects(JSON.parse(projectsRaw));

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
  } catch (err) {
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

  const greetingEl = $('.greeting');
  if (greetingEl && heroGreeting) greetingEl.textContent = heroGreeting;

  const heroQuoteEl = $('.hero-quote');
  if (heroQuoteEl && heroTitle) heroQuoteEl.textContent = heroTitle;

  const aboutEl = $('.about-text p');
  if (aboutEl && heroBio) aboutEl.textContent = heroBio;

  if (Array.isArray(skills) && skills.length) {
    const skillsGrid = $('.skills-grid');
    if (skillsGrid) {
      skillsGrid.innerHTML = skills
        .map(s => `<span class="skill-tag">${s}</span>`)
        .join('');
    }
  }

  // Update Contact Details on Live Site
  if (contactEmail) {
    const emailLink = document.querySelector('a.contact-link[href^="mailto:"]');
    if (emailLink) {
      emailLink.href = `mailto:${contactEmail}`;
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
    const locationLink = document.querySelector('a.contact-link[href*="maps"]');
    if (locationLink) {
      locationLink.textContent = contactLocation;
    }
  }

  // Update Social Media Links on Live Site
  if (facebookUrl) {
    const fb = document.querySelector('.social-links a[aria-label="Facebook"]');
    if (fb) fb.href = facebookUrl;
  }
  if (instagramUrl) {
    const ig = document.querySelector('.social-links a[aria-label="Instagram"]');
    if (ig) ig.href = instagramUrl;
  }
  if (githubUrl) {
    const gh = document.querySelector('.social-links a[aria-label="GitHub"]');
    if (gh) gh.href = githubUrl;
  }
  if (linkedinUrl) {
    const li = document.querySelector('.social-links a[aria-label="LinkedIn"]');
    if (li) li.href = linkedinUrl;
  }
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

    const links = buildLinks(project);
    const techTags = (project.tech || []).map(t => `<span>${t}</span>`).join('');

    article.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}"
             width="600" height="400" loading="lazy" decoding="async"
             onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><rect fill=\\'%23171717\\' width=\\'100\\' height=\\'100\\'/><text fill=\\'%23e11d48\\' font-family=\\'sans-serif\\' font-size=\\'12\\' x=\\'50%\\' y=\\'50%\\' text-anchor=\\'middle\\'>Image</text></svg>'">
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
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
    if (url) links.push(
      `<a href="${url}" class="project-link" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
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
      if (link.label && link.url) {
        add(link.url, link.label);
      }
    });
  } else {
    // Legacy fallback for single custom link or demoUrl
    if (project.customLabel && project.customUrl) {
      add(project.customUrl, project.customLabel);
    }
    if (project.demoUrl) {
      add(project.demoUrl, 'Live Demo');
    }
  }

  return links.join('');
}
