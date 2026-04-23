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
    serviceId: (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_EMAILJS_SERVICE_ID : '',
    templateId: (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_EMAILJS_TEMPLATE_ID : '',
    publicKey: (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_EMAILJS_PUBLIC_KEY : ''
  }
};
