// frontend/src/utils/constants.js
export const CHAT_MODES = {
  CHAT: 'chat',
  FILE: 'file',
  WEB: 'web',
  AEM: 'aem'
};

export const INTENT_TYPES = {
  CHAT: 'chat',
  FILE_UPLOAD: 'file_upload',
  WEB_SEARCH: 'web_search',
  AEM_QUERY: 'aem_query',
  AEM_COMPLIANCE: 'aem_compliance',
  UNKNOWN: 'unknown'
};

export const COMPLIANCE_CATEGORIES = [
  { id: 'accessibility', name: 'Accessibility', color: 'blue' },
  { id: 'seo', name: 'SEO', color: 'green' },
  { id: 'performance', name: 'Performance', color: 'yellow' },
  { id: 'security', name: 'Security', color: 'red' },
  { id: 'content_quality', name: 'Content Quality', color: 'purple' },
  { id: 'aem_specific', name: 'AEM Best Practices', color: 'indigo' }
];

export const SEVERITY_COLORS = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-blue-600 bg-blue-100'
};

export const GRADE_COLORS = {
  A: 'text-green-600 bg-green-100',
  B: 'text-blue-600 bg-blue-100',
  C: 'text-yellow-600 bg-yellow-100',
  D: 'text-orange-600 bg-orange-100',
  F: 'text-red-600 bg-red-100'
};
