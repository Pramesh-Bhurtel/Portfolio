# Pramesh Bhurtel | Personal Portfolio

![Portfolio Preview](assets/images/thumbnail.png)

A modern, responsive personal portfolio website showcasing projects, skills, and experience — built with performance, clean aesthetics, and real-time content management in mind.

🔗 **[Live Site: prameshbhurtel.com.np](https://prameshbhurtel.com.np/)**

---

## 🚀 Features

- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Smooth Animations** — Scroll-triggered reveals, micro-interactions, and cursor effects
- **Real-Time CMS** — Firebase Realtime Database powered project management with instant live updates
- **PWA Support** — Installable as a Progressive Web App with offline-capable structure
- **SEO Optimized** — Open Graph, Twitter Cards, JSON-LD structured data, sitemap, and robots.txt
- **Cloudflare Ready** — Configured for Cloudflare Pages with security headers, caching rules, and custom routing

---

## 💼 Featured Projects

| Project | Description |
|---|---|
| **Gorkhas Spirit** | Social media hub for Kathmandu Gorkhas FC fans |
| **Portfolio Website** | This very site — responsive, animated, Firebase-connected |
| **Nepal Premier League S2** | Box Office volunteer — ticketing & crowd coordination |
| **ViperHarmonics** | Digital harmonium with Web Audio API + MIDI support |
| **Fire Ninja** | HTML5 Canvas arcade slash game |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic) |
| Styling | Vanilla CSS3 (Custom Properties, Flexbox/Grid) |
| Logic | Vanilla JavaScript (ES6+ Modules) |
| Realtime DB | Firebase Realtime Database |
| Analytics | Google Analytics (GA4) |
| Email | EmailJS |
| Bundler | Vite 5 |
| Hosting | Cloudflare Pages |

---

## 💻 Local Development

This project uses **Vite** for local development and production bundling.

```bash
# Clone the repository
git clone https://github.com/Pramesh-Bhurtel/Portfolio.git

# Navigate into the directory
cd Portfolio

# Install dev dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment (Cloudflare Pages + GitHub)

This project is optimized for **Cloudflare Pages** via GitHub source deployment.

### Build Settings

| Setting | Value |
|---|---|
| **Framework preset** | None / Other |
| **Build command** | `npm run build` |
| **Output directory** | `dist` |
| **Root directory** | `/` (repository root) |

### Steps

1. Push your code to GitHub.
2. In the [Cloudflare Pages dashboard](https://pages.cloudflare.com/), connect your GitHub repository.
3. Apply the build settings above.
4. Click **Save and Deploy** — Cloudflare will build and publish automatically on every push.

Security headers, asset caching rules, and custom routing are all pre-configured via `public/_headers` and `public/_redirects`.

---

## 📁 Project Structure

```
Portfolio/
├── assets/              # Static images and downloadable files
├── public/              # Cloudflare config & SEO files
│   ├── _headers         # Security & cache headers
│   ├── _redirects       # Vanity URLs & 404 routing
│   ├── robots.txt       # Crawler rules
│   └── sitemap.xml      # SEO sitemap
├── src/
│   ├── css/             # Modular stylesheets
│   └── js/
│       ├── app.js       # Application bootstrap
│       └── modules/     # Feature modules (scroll, contact, etc.)
├── index.html           # Main portfolio page
├── 404.html             # Custom 404 error page
├── manifest.json        # PWA manifest
├── vite.config.js       # Vite bundler configuration
└── wrangler.jsonc       # Cloudflare Wrangler config
```

---

## 🔗 Vanity Shortcuts

| URL | Destination |
|---|---|
| `/github` | GitHub profile |
| `/linkedin` | LinkedIn profile |
| `/cv` | CV / Resume PDF |

---

## 📬 Contact

- **Email**: prameshbhurtel1@gmail.com
- **LinkedIn**: [prameshbhurtel](https://www.linkedin.com/in/prameshbhurtel/)
- **GitHub**: [Pramesh-Bhurtel](https://github.com/Pramesh-Bhurtel)
- **Instagram**: [@pramesh_bhurtel](https://www.instagram.com/pramesh_bhurtel/)

---

*Created with ❤️ by [Pramesh Bhurtel](https://prameshbhurtel.com.np)*
