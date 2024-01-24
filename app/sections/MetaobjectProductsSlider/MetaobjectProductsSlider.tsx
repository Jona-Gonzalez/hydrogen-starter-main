import {Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import {ProductItem, Svg} from '~/components';
import {Schema} from './MetaobjectProductsSlider.schema';
import {useColorSwatches} from '~/hooks';

export function MetaobjectProductsSlider({cms}) {
  const dataSourceReference = cms?.dataSource?.reference;
  const fields = {};
  dataSourceReference?.fields?.forEach((field) => {
    fields[field.key] = field.references || field.reference || field.value;
  });

  const {heading} = fields;
  const products = fields.products?.nodes;
  const {swatchesMap} = useColorSwatches();

  const sliderStyle = 'contained';
  const slidesPerViewDesktop = 4;
  const slidesPerViewTablet = 3.4;
  const slidesPerViewMobile = 1.4;
  const isFullBleedAndCentered = false;
  const isLoop = false;
  const maxWidthClass = 'max-w-[var(--content-max-width)]';

  return (
    <div className={`py-contained`}>
      <div className="m-auto flex flex-col items-center">
        <h2
          className="text-title-h2 px-4 text-center"
          style={{color: 'var(--text)'}}
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
            {products.map((product, index) => {
              return (
                <SwiperSlide key={index}>
                  {/* <ProductItem
                      enabledColorNameOnHover={false}
                      enabledColorSelector={false}
                      enabledQuickShop={false}
                      enabledStarRating={false}
                      handle={product?.handle}
                      index={index}
                      product={product}
                      swatchesMap={swatchesMap}
                    /> */}
                </SwiperSlide>
              );
            })}

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
      </div>
    </div>
  );
}

MetaobjectProductsSlider.displayName = 'MetaobjectProductsSlider';
MetaobjectProductsSlider.Schema = Schema;
