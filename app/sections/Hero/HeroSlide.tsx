import {Image} from '@shopify/hydrogen-react';
import {useInView} from 'react-intersection-observer';

import {HeroContent} from './HeroContent';
import {HeroVideo} from './HeroVideo';
import {HeroSlideProps} from './Hero.types';

export function HeroSlide({
  aboveTheFold,
  isActiveSlide,
  isFirstSlide,
  slide,
}: HeroSlideProps) {
  const {image, video} = slide;
  const {ref, inView} = useInView({
    rootMargin: '0px',
    triggerOnce: true,
  });
  const isVisible =
    (aboveTheFold && isActiveSlide) ||
    (!aboveTheFold && isActiveSlide && inView);

  return (
    <div className="relative h-full w-full" ref={ref}>
      <div className="relative h-full w-full overflow-hidden md:hidden">
        {video?.srcMobile && (
          <HeroVideo
            isVisible={isVisible}
            posterSrc={video.posterMobile?.src}
            videoSrc={video.srcMobile}
          />
        )}

        {image?.imageMobile?.src && !video?.srcMobile && (
          <Image
            data={{
              altText: image.alt,
              url: image.imageMobile.src,
            }}
            className={`media-fill ${image.positionMobile}`}
            loading="eager"
            sizes="100vw"
            // priority={aboveTheFold && isFirstSlide}
          />
        )}
      </div>

      <div className="relative hidden h-full w-full overflow-hidden md:block">
        {video?.srcDesktop && (
          <HeroVideo
            isVisible={isVisible}
            posterSrc={video.posterDesktop?.src}
            videoSrc={video.srcDesktop}
          />
        )}

        {image?.imageDesktop?.src && !video?.srcDesktop && (
          <Image
            data={{
              altText: image.alt,
              url: image.imageDesktop.src,
            }}
            className={`media-fill ${image.positionDesktop}`}
            loading="eager"
            sizes="100vw"
            // priority={aboveTheFold && isFirstSlide}
          />
        )}
      </div>

      <HeroContent
        aboveTheFold={aboveTheFold}
        isActiveSlide={isActiveSlide}
        isFirstSlide={isFirstSlide}
        slide={slide}
      />
    </div>
  );
}

HeroSlide.displayName = 'HeroSlide';
