import {useCallback, useEffect, useState} from 'react';

// e.g. const isDesktopViewport = useMatchMedia('(min-width: 768px)');
// NOTE: do not use match media to dictate the layout or visual elements between breakpoints, as it will cause hydration errors or layout shift and flashing of changing content with SSG upon hydration
// INSTEAD: use Tailwind breakpoint styling to avoid layout shift with SSG

function fallbackMatchMedia(query: string) {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return undefined;
  }
  return window.matchMedia(query);
}

function omitMatchMediaResult(matchMediaResult: any) {
  if (!matchMediaResult) {
    return undefined;
  }
  return {media: matchMediaResult.media, matches: matchMediaResult.matches};
}

function useMedia(query: string) {
  const [mounted, setMounted] = useState(false);

  const [result, setResult] = useState(() => {
    return omitMatchMediaResult(fallbackMatchMedia(query));
  });

  const callback = useCallback((matchMediaResult: any) => {
    return setResult(omitMatchMediaResult(matchMediaResult));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const matchMediaResult = fallbackMatchMedia(query);
    callback(matchMediaResult);
    if (matchMediaResult) {
      matchMediaResult.addEventListener('change', callback);
    }
    return () => {
      if (matchMediaResult) {
        matchMediaResult.removeEventListener('change', callback);
      }
    };
  }, [query]);

  if (!mounted) {
    return undefined;
  }

  return result;
}

export function useMatchMedia(query: string) {
  const result = useMedia(query);
  return (result && result.matches) || false;
}
