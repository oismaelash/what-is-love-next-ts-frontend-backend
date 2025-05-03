import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, event, EventCategories, EventActions } from '@/utils/analytics';

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  const trackEvent = (
    action: keyof typeof EventActions,
    category: keyof typeof EventCategories,
    label?: string,
    value?: number
  ) => {
    event({
      action: EventActions[action],
      category: EventCategories[category],
      label,
      value,
    });
  };

  return { trackEvent };
}; 