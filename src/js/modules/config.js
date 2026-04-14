export const Config = {
  typingSpeed: 100,
  deletingSpeed: 50,
  pauseBeforeDelete: 2000,
  pauseBeforeNext: 500,
  headerOffset: 80,
  phrases: [
    'Tech Enthusiast',
    'Student',
    'Problem Solver',
    'Code Explorer',
    'AI Explorer',
    'Innovator'
  ],
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  }
};
