import {Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import {Link, ProductItem, Svg} from '~/components';
import {ProductsSliderProps} from './ProductsSlider.types';
import {Schema} from './ProductsSlider.schema';
import {useColorSwatches} from '~/hooks';

export function ProductsSlider({cms}: {cms: ProductsSliderProps}) {
  const {button, heading, productItem, products, section, slider, textColor} =
    cms;

  const {swatchesMap} = useColorSwatches();

  const {sliderStyle} = {...slider};
  const slidesPerViewDesktop = slider?.slidesPerViewDesktop || 4;
  const slidesPerViewTablet = slider?.slidesPerViewTablet || 3.4;
  const slidesPerViewMobile = slider?.slidesPerViewMobile || 1.4;
  const isFullBleedAndCentered =
    sliderStyle === 'fullBleed' || sliderStyle === 'fullBleedWithGradient';
  const isLoop = isFullBleedAndCentered || sliderStyle === 'containedWithLoop';
  const maxWidthClass =
    section?.fullWidth || isFullBleedAndCentered
      ? 'max-w-none'
      : 'max-w-[var(--content-max-width)]';

  return (
    <div
      className={`py-contained ${
        !isFullBleedAndCentered ? 'lg:px-contained' : ''
      }`}
    >
      <div className="m-auto flex flex-col items-center">
        <h2
          className="text-title-h2 px-4 text-center"
          style={{color: textColor}}
        >
          {heading}
        </h2>

        {products && (
          <Swiper
            centeredSlides={
              isFullBleedAndCentered &&
              products.length >= slidesPerViewMobile * 2
            }
            className={`relative mt-10 w-full ${maxWidthClass} ${
              sliderStyle === 'fullBleedWithGradient'
                ? 'before:swiper-offset-gradient-270-left after:swiper-offset-gradient-270-right'
                : ''
            }`}
            grabCursor
            loop={isLoop && products.length >= slidesPerViewMobile * 2}
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
              disabledClass: 'cursor-not-allowed opacity-20',
            }}
            slidesOffsetAfter={isFullBleedAndCentered ? 0 : 16}
            slidesOffsetBefore={isFullBleedAndCentered ? 0 : 16}
            slidesPerView={slidesPerViewMobile}
            spaceBetween={16}
            breakpoints={{
              768: {
                centeredSlides:
                  isFullBleedAndCentered &&
                  products.length >= slidesPerViewTablet * 2,
                loop: isLoop && products.length >= slidesPerViewTablet * 2,
                slidesPerView: slidesPerViewTablet,
                spaceBetween: 20,
                slidesOffsetBefore: isFullBleedAndCentered ? 0 : 32,
                slidesOffsetAfter: isFullBleedAndCentered ? 0 : 32,
              },
              1024: {
                centeredSlides:
                  isFullBleedAndCentered &&
                  products.length >= slidesPerViewDesktop * 2,
                loop: isLoop && products.length >= slidesPerViewDesktop * 2,
                slidesPerView: slidesPerViewDesktop,
                spaceBetween: 20,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
              },
            }}
          >
            {products.map(({product}, index) => {
              return (
                <SwiperSlide key={index}>
                  <ProductItem
                    enabledColorNameOnHover={
                      productItem?.enabledColorNameOnHover
                    }
                    enabledColorSelector={productItem?.enabledColorSelector}
                    enabledQuickShop={productItem?.enabledQuickShop}
                    enabledStarRating={productItem?.enabledStarRating}
                    handle={product?.handle}
                    index={index}
                    swatchesMap={swatchesMap}
                  />
                </SwiperSlide>
              );
            })}

            {/* Navigation */}
            {products.length > slidesPerViewDesktop && (
              <div className="z-1 absolute left-0 right-0 top-[calc(50%-28px)] md:px-8 xl:px-14">
                <div
                  className={`relative mx-auto ${maxWidthClass} ${
                    isFullBleedAndCentered ? 'min-[90rem]:max-w-full' : ''
                  }`}
                >
                  <div
                    className={`swiper-button-prev left-0 top-[calc(50%-1.6875rem)] !hidden !h-[3.5rem] !w-[3.5rem] rounded-full border border-border bg-white after:hidden lg:!flex ${
                      !isFullBleedAndCentered ? 'xl:-left-[1.6875rem]' : ''
                    }`}
                  >
                    <Svg
                      className="max-w-[1.25rem] text-black"
                      src="/svgs/arrow-left.svg#arrow-left"
                      title="Arrow Left"
                      viewBox="0 0 24 24"
                    />
                  </div>

                  <div
                    className={`swiper-button-next right-0 top-[calc(50%-1.6875rem)] !hidden !h-[3.5rem] !w-[3.5rem] rounded-full border border-border bg-white after:hidden lg:!flex ${
                      !isFullBleedAndCentered ? 'xl:-right-[1.6875rem]' : ''
                    }`}
                  >
                    <Svg
                      className="max-w-[1.25rem] text-black"
                      src="/svgs/arrow-right.svg#arrow-right"
                      title="Arrow Right"
                      viewBox="0 0 24 24"
                    />
                  </div>
                </div>
              </div>
            )}
          </Swiper>
        )}

        {/* Footer button */}
        {button?.text && (
          <div className="mt-10">
            <Link
              aria-label={button.text}
              className={`${section?.buttonStyle || 'btn-primary'}`}
              to={button.url}
              newTab={button.newTab}
              type={button.type}
            >
              {button.text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

ProductsSlider.displayName = 'ProductsSlider';
ProductsSlider.Schema = Schema;