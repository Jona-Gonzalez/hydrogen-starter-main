import {useInView} from 'react-intersection-observer';
import {Image} from '@shopify/hydrogen-react';

import {Link} from '~/components';

export function CollectionPromoTile({tile}) {
  const {ref, inView} = useInView({
    rootMargin: '0px',
    triggerOnce: true,
  });

  const {aspectRatio, background, link, text} = tile;
  const {alt, bgColor, darkOverlay, image, videoPoster, videoSrc} = {
    ...background,
  };

  return (
    <Link
      aria-label={text?.heading || link?.text}
      className="h-full"
      to={link?.url}
      newTab={link?.newTab}
      ref={ref}
      type={link?.type}
    >
      <div
        className={`relative ${aspectRatio} overflow-hidden`}
        style={{
          backgroundColor: image ? 'var(--off-white)' : bgColor,
        }}
      >
        {videoSrc && (
          <video
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
            controls={false}
            loop
            muted
            playsInline
            poster={videoPoster?.src}
          >
            {inView && <source src={videoSrc} type="video/mp4" />}
          </video>
        )}

        {image?.src && !videoSrc && (
          <Image
            data={{
              altText: alt || image.altText,
              url: image.src,
            }}
            className="media-fill"
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        )}

        {(videoSrc || image?.src) && darkOverlay && (
          <div className="pointer-events-none absolute inset-0 h-full w-full bg-[rgba(0,0,0,0.2)]" />
        )}

        {(text?.heading || text?.subtext) && (
          <div
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center"
            style={{color: text?.textColor}}
          >
            <h3 className="text-xl lg:text-2xl">{text?.heading}</h3>

            {text?.subtext && (
              <p className="mt-4 text-sm lg:text-base">{text?.subtext}</p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

CollectionPromoTile.displayName = 'CollectionPromoTile';
