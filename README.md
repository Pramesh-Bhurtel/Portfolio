# Pramesh Bhurtel — Portfolio Infrastructure

Production repository for **[prameshbhurtel.com.np](https://prameshbhurtel.com.np/)**.

## ⚡ Technical Architecture

* **Core Stack**: HTML5, Vanilla CSS3 (Custom Properties, Grid/Flexbox), ES6+ JavaScript Modules.
* **Build Engine**: Vite 5 static bundler with automated CSS inlining and Rollup externalization.
* **Realtime Infrastructure**: Firebase Realtime Database with live CRUD synchronization.
* **Edge Delivery**: Cloudflare Worker (`_worker.js`) proxying static assets and serving runtime secrets dynamically from Cloudflare Worker Secrets.
* **SEO & Metadata**: Semantic HTML5, Open Graph, Twitter Cards, JSON-LD structured schema, sitemap, and robots.txt.
* **Security & Telemetry**: Stealth admin CMS trigger, automated honeypot trap, rate-limited email access alerts, and Content Security Policy headers.

## 📁 Repository Map

```text
├── assets/              # Compressed WebP imagery and downloadable resume
├── public/              # Cloudflare edge headers, redirects, robots.txt, sitemap
├── src/                 # CSS design system tokens, components, modular JS
├── index.html           # Portfolio core interface
├── admin-dashboard.html # Production CMS workspace
├── _worker.js           # Cloudflare Worker edge handler & runtime secrets server
├── wrangler.jsonc       # Cloudflare Wrangler deployment configuration
└── vite.config.js       # Vite build & bundle pipeline configuration
```

---
© Pramesh Bhurtel. All rights reserved.
