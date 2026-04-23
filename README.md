# Pramesh Bhurtel | Personal Portfolio

![Pramesh Bhurtel Portfolio](assets/images/thumbnail.png)

A modern, responsive personal portfolio website designed to showcase my skills, projects, and experiences. Built with a focus on smooth animations, clean layout, and high-fidelity design to create an engaging user experience.

🔗 **[Live Demo: prameshbhurtel.com.np](https://prameshbhurtel.com.np/)**

## 🚀 Key Features

*   **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop devices.
*   **Modern Aesthetics**: Clean design utilizing CSS variables, grain overlays, orbit animations, and smooth scroll reveals.
*   **Performance & Architecture**: Highly modular, vanilla JavaScript architecture (`src/js/modules`) prioritizing fast loading, no UI thrashing, and zero dependencies. 
*   **SEO & PWA Optimized**: Comprehensive metadata (Open Graph, Twitter Cards), JSON-LD structured data, and PWA capabilities (`manifest.json`).
*   **Cloudflare Integration**: Specifically configured for Cloudflare Pages with customized routing (`_redirects`), security headers (`_headers`), and `wrangler.jsonc` support.

## 💼 Featured Projects

*   **Gorkhas Spirit**: A dedicated social media hub for Kathmandu Gorkhas uniting fans through engaging content.
*   **Portfolio Website**: A modern, responsive portfolio website highlighting projects and skills.
*   **Nepal Premier League S2**: Volunteer management and ticketing workflow representation.
*   **ViperHarmonics**: High-fidelity digital harmonium using the Web Audio API with MIDI support.
*   **Fire Ninja**: A blazing arcade slash game built with HTML5 Canvas.

## 💻 Tech Stack

*   **Frontend Core**: HTML5, CSS3 (Custom Properties, Flexbox/Grid)
*   **Logic & Interactions**: Vanilla JavaScript (ES6+ Modules)
*   **Analytics & Metadata**: Google Analytics, JSON-LD Structured Data
*   **Deployment & Hosting**: Cloudflare Pages

## 🛠️ Local Development

This project uses native ES modules, so it must be served via a local web server to function correctly (opening `index.html` directly via the `file://` protocol will cause CORS issues with modules).

```bash
# Clone the repository
git clone https://github.com/Pramesh-Bhurtel/Portfolio.git

# Navigate into the directory
cd Portfolio

# Start a local web server (e.g., using Python)
python -m http.server 8000
# Or using Node.js (npx)
npx serve .
```

## ☁️ Deployment (Cloudflare Pages)

This project is optimized for deployment on **Cloudflare Pages**.

1. Connect your GitHub repository to Cloudflare Pages.
2. Select **None** as the framework preset (it is a static site).
3. Ensure the Build command is empty and the Output directory is set to your repository root (`/` or `.`).
4. To enable the contact form, configure your EmailJS credentials in `src/js/modules/env.js` (or via your client-side environment setup).
5. The `_headers` and `_redirects` files automatically handle security policies and URL routing.

## 📬 Contact

I am always open to discussing exciting projects and new opportunities!

*   **Email**: contact@prameshbhurtel.com.np
*   **LinkedIn**: [prameshbhurtel](https://www.linkedin.com/in/prameshbhurtel/)
*   **GitHub**: [Pramesh-Bhurtel](https://github.com/Pramesh-Bhurtel)
*   **Instagram**: [@pramesh_bhurtel](https://www.instagram.com/pramesh_bhurtel/)

---
*Created with ❤️ by [Pramesh Bhurtel](https://prameshbhurtel.com.np)*
