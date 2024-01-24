import {useEffect, useMemo} from 'react';
import {useSiteSettings} from '@pack/react';
import {useProduct} from '@shopify/hydrogen-react';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {ProductDetails} from './ProductDetails';
import {ProductHeader} from './ProductHeader';
import {ProductMedia} from './ProductMedia';
import {useDataLayerViewProduct} from '~/hooks';

export function Product({product}: any) {
  const {selectedVariant} = useProduct();
  const siteSettings = useSiteSettings();
  const settings = siteSettings?.settings?.product;

  // const {productDetailAccordionsSection, belowTheFoldSections} = useMemo(() => {
  //   if (!sections) return {};
  //   return {
  //     productDetailAccordionsSection: sections.find(({props}) => {
  //       return props?.['data-comp'] === 'product-detail-accordions';
  //     }),
  //     belowTheFoldSections: sections.filter(({props}) => {
  //       return props?.['data-comp'] !== 'product-detail-accordions';
  //     }),
  //   };
  // }, [sections]);

  useDataLayerViewProduct({product, selectedVariant});

  const selectedVariantColor = useMemo(() => {
    return selectedVariant?.selectedOptions.find(
      ({name}) => name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  // set variant url param on selected variant change unless has one variant
  useEffect(() => {
    if (product.variants.nodes.length === 1 || !selectedVariant) return;

    const {origin, search} = window.location;

    const params = new URLSearchParams(search);
    selectedVariant.selectedOptions.forEach(({name, value}) => {
      params.set(name, value);
    });

    const updatedUrl = `${origin}/products/${product.handle}?${params}`;

    window.history.replaceState(window.history.state, '', updatedUrl);
  }, [product.handle, selectedVariant?.id]);

  // retain scroll position on product grouping variant change
  useEffect(() => {
    const cachedScrollY = window.sessionStorage.getItem(
      'CACHED_PDP_SCROLL_Y_POSITION',
    );
    if (cachedScrollY) {
      setTimeout(() => {
        window.scrollTo(0, cachedScrollY);
        window.sessionStorage.removeItem('CACHED_PDP_SCROLL_Y_POSITION');
      }, 0);
    }
  }, []);

  const stickyPromobar =
    siteSettings?.settings?.header?.promobar?.enabled &&
    !siteSettings?.settings?.header?.promobar?.autohide;
  const stickyTopClass = stickyPromobar
    ? 'md:top-[calc(var(--header-height)+var(--promobar-height)+2.5rem)] xl:top-[calc(var(--header-height)+var(--promobar-height)+3rem)]'
    : 'md:top-[calc(var(--header-height)+2.5rem)] xl:top-[calc(var(--header-height)+3rem)]';

  return (
    <section data-comp="product">
      <div className="md:px-contained py-6 md:py-10 lg:py-12">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-y-5 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-y-4">
          {/* mobile header placement */}
          {/* note: remove this component if mobile header shares same placement as desktop */}
          <ProductHeader
            isMobile
            product={product}
            selectedVariant={selectedVariant}
            selectedVariantColor={selectedVariantColor}
            settings={settings}
          />

          <div>
            <div className={`md:sticky ${stickyTopClass}`}>
              <ProductMedia
                product={product}
                selectedVariantColor={selectedVariantColor}
              />
            </div>
          </div>

          <div className="px-4 md:px-0">
            <div
              className={`flex flex-col gap-y-4 md:sticky ${stickyTopClass}`}
            >
              {/* desktop header placement */}
              <ProductHeader
                product={product}
                selectedVariant={selectedVariant}
                selectedVariantColor={selectedVariantColor}
                settings={settings}
              />

              <ProductDetails
                enabledQuantitySelector={settings?.quantitySelector?.enabled}
                product={product}
                // productDetailAccordionsSection={productDetailAccordionsSection}
                selectedVariant={selectedVariant}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Product.displayName = 'Product';
