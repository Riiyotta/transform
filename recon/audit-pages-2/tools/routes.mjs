export const R = {
  blog: '/blog',
  athena: '/blog/ai-voice-agents-for-athenahealth-7-questions-to-ask-before-choosing-a-platform',
  january: '/blog/medical-practice-call-volume-january',
  ent: '/blog/ent-reimbursement-in-2027-what-medicare-s-proposed-cuts-mean-for-otolaryngology-practices',
  ortho: '/blog/orthopedic-ai-answering-service',
  redefining: '/blog/redefining-healthcare-ai',
  twelve: '/blog/the-12-month-shift-why-voice-ai-agents-are-now-a-financial-imperative-for-specialty-practices',
  ivr: '/blog/why-traditional-ivr-is-failing-your-practice-and-how-ai-voice-agents-fix-the-press-0-trap',
  generic: '/blog/why-generic-ai-virtual-assistants-fail-specialty-medical-practices-and-what-actually-works',
  cs: '/case-studies',
  sbj: '/case-studies/southern-bone-joint',
  toc: '/case-studies/the-orthopaedic-center',
};
export const secsFor = (k) => k === 'blog' || k === 'cs'
  ? [['hero', 'section.hero'], ['list', 'section.all-blogs-section']]
  : [['header', 'section.blog-top-header'], ['body', 'section.post-body-section'], ['readnext', 'section.read-next-section']];
