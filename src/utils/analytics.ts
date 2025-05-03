// Google Analytics event tracking utility
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID!, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Common event categories
export const EventCategories = {
  USER: 'User',
  DEFINITION: 'Definition',
  FAVORITE: 'Favorite',
  SEARCH: 'Search',
  NAVIGATION: 'Navigation',
  AUTH: 'Authentication',
  HIGHLIGHT: 'Highlight',
  PAYMENT: 'Payment',
} as const;

// Common event actions
export const EventActions = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  REGISTER: 'Register',
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  VIEW: 'View',
  SEARCH: 'Search',
  CLICK: 'Click',
  NAVIGATE: 'Navigate',
  FAVORITE: 'Favorite',
  START: 'Start',
  SUCCESS: 'Success',
  ERROR: 'Error',
  OPEN_DIALOG: 'Open Dialog',
  CLOSE_DIALOG: 'Close Dialog',
  REDIRECT: 'Redirect',
  PIX: 'PIX',
} as const; 