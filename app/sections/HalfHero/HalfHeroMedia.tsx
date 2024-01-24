import {Image} from '@shopify/hydrogen-react';

import {HalfHeroMediaProps} from './HalfHero.types';
import {HalfHeroVideo} from './HalfHeroVideo';

export function HalfHeroMedia({
  aboveTheFold,
  media,
  videoAlt,
}: HalfHeroMediaProps) {
  const {image, video} = {...media};
  return (
    <div className="absolute inset-0 h-full w-full">
      <div className="relative h-full w-full overflow-hidden md:hidden">
        {video?.srcMobile && (
          <HalfHeroVideo
            autoplay={video.autoplay}
            posterSrc={video.posterMobile?.src}
            sound={video.sound}
            videoAlt={videoAlt}
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
            loading={aboveTheFold ? 'eager' : 'lazy'}
            sizes="100vw"
          />
        )}
      </div>

      <div className="relative hidden h-full w-full overflow-hidden md:block">
        {video?.srcDesktop && (
          <HalfHeroVideo
            autoplay={video.autoplay}
            posterSrc={video.posterDesktop?.src}
            sound={video.sound}
            videoAlt={videoAlt}
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
            loading={aboveTheFold ? 'eager' : 'lazy'}
            sizes="50vw"
          />
        )}
      </div>
    </div>
  );
}

HalfHeroMedia.displayName = 'HalfHeroMedia';
