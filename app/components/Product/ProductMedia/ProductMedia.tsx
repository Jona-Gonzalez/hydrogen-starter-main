import {useCallback, useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, Pagination} from 'swiper/modules';

import {Badges} from '~/components';
import {MEDIA_IMAGE_KEY_BY_TYPE} from '~/lib/constants';
import {ProductImage} from './ProductImage';
import {ProductMediaFile} from './ProductMediaFile';
import {ProductMediaThumbnails} from './ProductMediaThumbnails';

export function ProductMedia({product, selectedVariantColor}) {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [swiperReady, setSwiperReady] = useState(false);

  const handleSwiperOnLoad = useCallback((index) => {
    if (index !== 0) return;
    setSwiperReady(true);
  }, []);

  // Reset the active index when the selected color changes
  useEffect(() => {
    if (!swiper) return;
    setActiveIndex(0);
    // swiper?.slideTo(0);
  }, [selectedVariantColor, swiper]);

  const media = product.media.nodes;
  const firstMediaImage =
    media[0]?.[MEDIA_IMAGE_KEY_BY_TYPE[media[0]?.mediaContentType]];

  return (
    <div className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-[80px_calc(100%-100px)] xl:gap-5">
      <div className="order-1 lg:order-2">
        <div
          className="relative md:bg-offWhite"
          // for a static/consistent aspect ratio, delete style below and add 'aspect-[var(--product-image-aspect-ratio)]' to className
          style={{
            aspectRatio:
              firstMediaImage?.width && firstMediaImage?.height
                ? firstMediaImage.width / firstMediaImage.height
                : 'var(--product-image-aspect-ratio)',
          }}
        >
          <Swiper
            onSwiper={setSwiper}
            modules={[A11y, Pagination]}
            onSlideChange={(_swiper) => {
              setActiveIndex(_swiper.realIndex);
            }}
            slidesPerView={1}
            grabCursor
            pagination={{
              el: '.swiper-pagination',
              clickable: true,
            }}
            className="max-md:!pb-5 md:pb-0"
          >
            {media.map((media, index) => {
              return (
                <SwiperSlide key={media.id}>
                  <ProductMediaFile
                    alt={product.title}
                    media={media}
                    onLoad={() => handleSwiperOnLoad(index)}
                  />
                </SwiperSlide>
              );
            })}

            <div className="active-bullet-black swiper-pagination !top-[calc(100%-8px)] flex w-full justify-center gap-2.5 md:hidden" />
          </Swiper>

          {/* placeholder image while swiper inits */}
          {!swiperReady && (
            <div className="absolute inset-0 z-[1] h-full w-full max-md:hidden">
              <ProductImage
                alt={product.title}
                image={firstMediaImage}
                priority
              />
            </div>
          )}

          <div className="pointer-events-none absolute left-0 top-0 z-[1] p-2.5 xs:p-4 md:p-3 xl:p-4">
            <Badges
              isDraft={product.publishedAt === null}
              tags={product.tags}
            />
          </div>
        </div>
      </div>

      <div className="scrollbar-hide relative order-2 hidden w-full overflow-x-auto md:block md:max-lg:pb-[calc((100%-5*8px)/6)] lg:order-1 lg:h-[calc(80px*5+12px*4)] xl:h-[calc(80px*6+12px*5)]">
        {media.length > 0 && (
          <ProductMediaThumbnails
            activeIndex={activeIndex}
            media={media}
            productTitle={product.title}
            setActiveIndex={setActiveIndex}
            swiper={swiper}
          />
        )}
      </div>
    </div>
  );
}

ProductMedia.displayName = 'ProductMedia';
