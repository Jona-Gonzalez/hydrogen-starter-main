import {Image} from '@shopify/hydrogen-react';

import {Link, Svg} from '~/components';
import {Schema} from './SocialImagesGrid.schema';
import {SocialImagesGridProps} from './SocialImagesGrid.types';

export function SocialImagesGrid({cms}: {cms: SocialImagesGridProps}) {
  const {images, section} = cms;
  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <div className={`py-px ${section?.fullBleed ? '' : 'px-contained'}`}>
      <ul
        className={`mx-auto grid grid-cols-2 gap-px sm:grid-cols-4 ${maxWidthClass}`}
      >
        {images?.slice(0, 4).map((item, index) => {
          return (
            <li key={index}>
              <Link
                aria-label={`Open new tab to view ${item.platform} post`}
                to={item.url}
                newTab
              >
                <div className="relative aspect-square bg-offWhite">
                  {item.image?.src && (
                    <Image
                      data={{
                        altText: item.alt,
                        url: item.image.src,
                      }}
                      className="media-fill"
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  )}

                  <Svg
                    className="absolute right-2 top-2 w-4 text-white lg:right-3 lg:top-3 lg:w-5"
                    src={`/svgs/social/${item.platform}.svg#${item.platform}`}
                    title={item.platform}
                    viewBox="0 0 24 24"
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

SocialImagesGrid.displayName = 'SocialImagesGrid';
SocialImagesGrid.Schema = Schema;
