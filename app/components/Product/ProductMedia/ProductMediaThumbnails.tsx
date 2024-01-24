import {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

import {MEDIA_IMAGE_KEY_BY_TYPE} from '~/lib/constants';
import {ProductMediaThumbnail} from './ProductMediaThumbnail';

export function ProductMediaThumbnails({
  activeIndex,
  media,
  productTitle,
  setActiveIndex,
  swiper,
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      {/* placeholder thumbs while swiper inits */}
      {!thumbsSwiper && (
        <div className="absolute left-0 top-0 z-[2] flex w-full flex-row gap-2 lg:flex-col lg:gap-3">
          {media.slice(0, 6).map((mediaItem, index) => {
            const {id, mediaContentType} = mediaItem;
            const isActive = index === activeIndex;
            const previewSrc =
              mediaItem[MEDIA_IMAGE_KEY_BY_TYPE[mediaContentType]].url;
            return (
              <ProductMediaThumbnail
                alt={productTitle}
                index={index}
                isActive={isActive}
                key={id}
                mediaContentType={mediaContentType}
                src={previewSrc}
              />
            );
          })}
        </div>
      )}

      <Swiper
        modules={[Navigation]}
        className="max-lg:absolute max-lg:left-0 max-lg:top-0 max-lg:w-full lg:h-full"
        grabCursor
        onSwiper={setThumbsSwiper}
        preventClicks={false}
        preventClicksPropagation={false}
        slidesPerView={6}
        spaceBetween={8}
        onSlideChange={(_swiper) => {
          setActiveIndex(_swiper.realIndex);
          swiper.slideTo(_swiper.realIndex);
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        breakpoints={{
          1024: {
            direction: 'vertical',
            slidesPerView: 5,
            spaceBetween: 12,
          },
          1280: {
            direction: 'vertical',
            slidesPerView: 6,
            spaceBetween: 12,
          },
        }}
      >
        {media.map((mediaItem, index) => {
          const {id, mediaContentType} = mediaItem;
          const isActive = index === activeIndex;
          const previewSrc =
            mediaItem[MEDIA_IMAGE_KEY_BY_TYPE[mediaContentType]].url;
          return (
            <SwiperSlide key={id}>
              <ProductMediaThumbnail
                alt={productTitle}
                index={index}
                isActive={isActive}
                mediaContentType={mediaContentType}
                src={previewSrc}
                swiper={swiper}
              />
            </SwiperSlide>
          );
        })}

        <div className="swiper-button-prev !left-0 !text-black opacity-90 after:flex after:h-5 after:w-5 after:items-center after:justify-center after:overflow-hidden after:rounded-[50%] after:bg-white after:!text-[0.6rem] after:!content-['prev'] lg:!left-1/2 lg:!top-5 lg:!-translate-x-1/2 lg:!rotate-90" />

        <div className="swiper-button-next !right-0 !text-black opacity-90 after:flex after:h-5 after:w-5 after:items-center after:justify-center after:overflow-hidden after:rounded-[50%] after:bg-white after:!text-[0.6rem] after:!content-['next'] lg:!bottom-0 lg:!left-1/2 lg:!top-auto lg:!-translate-x-1/2 lg:!rotate-90" />
      </Swiper>
    </>
  );
}

ProductMediaThumbnails.displayName = 'ProductMediaThumbnails';
