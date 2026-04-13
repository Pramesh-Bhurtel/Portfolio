# GitHub Environment Configuration Guide

## Overview
This document explains how to set up environment variables for the BCS Exam Planner project on GitHub, particularly for sensitive credentials like EmailJS API keys.

## Environment Variables Setup

### 1. Create a `.env.local` file (Local Development)
For local development, create a `.env.local` file in the project root:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Important:** Never commit this file to version control. Add it to `.gitignore`:
```
.env.local
.env.*.local
```

### 2. GitHub Secrets (CI/CD and Production)
For GitHub Actions and deployment workflows, set up secrets in your GitHub repository:

#### Steps:
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret individually:
   - **Name:** `VITE_EMAILJS_SERVICE_ID`
   - **Value:** Your EmailJS service ID
   
   - **Name:** `VITE_EMAILJS_TEMPLATE_ID`
   - **Value:** Your EmailJS template ID
   
   - **Name:** `VITE_EMAILJS_PUBLIC_KEY`
   - **Value:** Your EmailJS public key

### 3. Using Environment Variables in GitHub Actions
In your `.github/workflows/` files, pass the secrets to your build step:

```yaml
- name: Build
  env:
    VITE_EMAILJS_SERVICE_ID: ${{ secrets.VITE_EMAILJS_SERVICE_ID }}
    VITE_EMAILJS_TEMPLATE_ID: ${{ secrets.VITE_EMAILJS_TEMPLATE_ID }}
    VITE_EMAILJS_PUBLIC_KEY: ${{ secrets.VITE_EMAILJS_PUBLIC_KEY }}
  run: npm run build
```

### 4. Vercel/Netlify Deployment
If deploying to Vercel or Netlify:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add the three variables above

**Netlify:**
1. Go to Site Settings → Build & Deploy → Environment
2. Add the three variables above

## Security Best Practices

- ✅ **Do** use environment variables for all sensitive data
- ✅ **Do** add `.env.local` to `.gitignore`
- ✅ **Do** rotate API keys periodically
- ❌ **Don't** commit secrets to version control
- ❌ **Don't** share secrets in documentation or pull requests
- ❌ **Don't** expose keys in client-side code (use backend proxies when possible)

## Reference
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
