import {Navigation, Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import {Link, ReviewStars, Svg} from '~/components';
import {Schema} from './TestimonialSlider.schema';
import {TestimonialSliderProps} from './TestimonialSlider.types';

export function TestimonialSlider({cms}: {cms: TestimonialSliderProps}) {
  const {heading, link, section, testimonialSlides: blocks} = {...cms};
  const {
    bgColor,
    fullWidth,
    reviewStarColor,
    sliderPaginationBulletColor,
    textColor,
  } = {
    ...section,
  };
  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <div
      className="md:px-contained py-12 lg:py-16"
      style={{backgroundColor: bgColor}}
    >
      <div
        className={`${maxWidthClass} relative mx-auto flex flex-col items-center lg:px-14`}
      >
        <h2
          className="text-title-h2 px-4 text-center"
          style={{color: textColor}}
        >
          {heading}
        </h2>

        {blocks?.length > 0 && (
          <Swiper
            className="!static mt-10 w-full"
            grabCursor
            loop={blocks.length >= 2}
            pagination={{
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: true,
              renderBullet(_, className) {
                return `<span class="${className}" style="background-color: ${sliderPaginationBulletColor}"></span>`;
              },
            }}
            modules={[Pagination, Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
              disabledClass: 'cursor-not-allowed opacity-20',
            }}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{
              768: {
                loop: blocks.length >= 4,
                slidesPerView: 2,
                spaceBetween: 0,
              },
              1024: {
                loop: blocks.length >= 6,
                slidesPerView: 3,
                spaceBetween: 0,
              },
            }}
          >
            {blocks.map((item, index) => {
              const rating = item.rating ? parseFloat(item.rating) : 5;
              return (
                <SwiperSlide key={index}>
                  <div
                    className="mx-auto flex max-w-[18.75rem] flex-col items-center text-center lg:max-w-[15.625rem]"
                    style={{
                      color: textColor,
                    }}
                  >
                    <ReviewStars rating={rating} color={reviewStarColor} />

                    <h3 className="my-4 text-2xl">{item.title}</h3>

                    {item.body && <p>{item.body}</p>}

                    {item.author && (
                      <p className="mt-4 text-base font-normal">
                        {item.author}
                      </p>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}

            <div className="swiper-pagination !static mt-6 lg:!hidden" />

            <div
              className={`swiper-button-prev left-0 !hidden !h-[3.5rem] !w-[3.5rem] rounded-full bg-white after:hidden ${
                blocks.length > 3 ? 'lg:!flex' : 'lg:!hidden'
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
              className={`swiper-button-next right-0 !hidden !h-[3.5rem] !w-[3.5rem] rounded-full bg-white after:hidden ${
                blocks.length > 3 ? 'lg:!flex' : 'lg:!hidden'
              }`}
            >
              <Svg
                className="max-w-[1.25rem] text-black"
                src="/svgs/arrow-right.svg#arrow-right"
                title="Arrow Right"
                viewBox="0 0 24 24"
              />
            </div>
          </Swiper>
        )}

        {link?.text && (
          <div className="mt-10">
            <Link
              aria-label={link.text}
              className="btn-primary"
              to={link.url}
              newTab={link.newTab}
              type={link.type}
            >
              {link.text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

TestimonialSlider.displayName = 'TestimonialSlider';
TestimonialSlider.Schema = Schema;