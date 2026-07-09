import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      input: {
        main: './index.html',
        notFound: './404.html'
      }
    }
  },
  plugins: [
    {
      name: 'inline-css',
      enforce: 'post',
      generateBundle(options, bundle) {
        const cssFiles = Object.keys(bundle).filter(fileName => fileName.endsWith('.css'));
        const htmlFiles = Object.keys(bundle).filter(fileName => fileName.endsWith('.html'));

        htmlFiles.forEach(htmlFileName => {
          let html = bundle[htmlFileName].source;
          
          cssFiles.forEach(cssFileName => {
            const cssChunk = bundle[cssFileName];
            const styleTag = `<style>${cssChunk.source}</style>`;
            
            // Remove the <link> tag injected by Vite for this CSS file
            // Note: vite injects it as an absolute path usually e.g., /assets/main.css
            // We use a regex that safely matches the filename anywhere in the link tag
            const escapedCssName = cssFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const linkRegex = new RegExp(`<link[^>]+href=["'][^"']*${escapedCssName}["'][^>]*>`, 'g');
            html = html.replace(linkRegex, '');
            
            // Inject the inline <style> tag before </head>
            html = html.replace('</head>', `${styleTag}\n</head>`);
          });
          
          bundle[htmlFileName].source = html;
        });
        
        // Remove CSS files from bundle so they aren't generated as separate files
        cssFiles.forEach(cssFileName => {
          delete bundle[cssFileName];
        });
      }
    }
  ]
});
