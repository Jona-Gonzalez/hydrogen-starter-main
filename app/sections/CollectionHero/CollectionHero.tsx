import {Image} from '@shopify/hydrogen-react';

import {CollectionHeroContainer} from './CollectionHeroContainer';
import {CollectionHeroContent} from './CollectionHeroContent';
import {CollectionHeroProps} from './CollectionHero.types';
import {Schema} from './CollectionHero.schema';

export function CollectionHero({cms}: {cms: CollectionHeroProps}) {
  const {content, image, section, text} = cms;

  return (
    <CollectionHeroContainer cms={cms}>
      <div
        className="absolute inset-0 h-full w-full overflow-hidden md:hidden"
        style={{
          backgroundColor: image?.imageMobile?.src
            ? 'var(--off-white)'
            : section?.bgColor,
        }}
      >
        {image?.imageMobile?.src && (
          <Image
            data={{
              altText: image.alt,
              url: image.imageMobile.src,
            }}
            className={`media-fill ${image.positionMobile}`}
            loading="eager"
            sizes="100vw"
          />
        )}
      </div>

      <div
        className="absolute inset-0 hidden h-full w-full overflow-hidden md:block"
        style={{
          backgroundColor: image?.imageDesktop?.src
            ? 'var(--off-white)'
            : section?.bgColor,
        }}
      >
        {image?.imageDesktop?.src && (
          <Image
            data={{
              altText: image.alt,
              url: image.imageDesktop.src,
            }}
            className={`media-fill ${image.positionDesktop}`}
            loading="eager"
            sizes="100vw"
          />
        )}
      </div>

      <CollectionHeroContent content={content} text={text} />
    </CollectionHeroContainer>
  );
}

CollectionHero.displayName = 'CollectionHero';
CollectionHero.Schema = Schema;
