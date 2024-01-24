import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';

export function useColorSwatches() {
  const siteSettings = useSiteSettings();
  const {swatches} = {...siteSettings?.settings?.product?.colors};

  const swatchesMap = useMemo(() => {
    if (!swatches?.length) return {};
    return swatches.reduce((acc, {name, color, image}) => {
      return {
        ...acc,
        [name?.toLowerCase().trim()]: image?.src || color,
      };
    }, {});
  }, [swatches]);

  return {swatchesMap};
}
