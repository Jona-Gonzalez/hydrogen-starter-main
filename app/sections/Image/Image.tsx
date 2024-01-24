import {useMemo} from 'react';
import {Image as ShopifyImage} from '@shopify/hydrogen-react';

import {ImageProps} from './Image.types';
import {Link, Markdown} from '~/components';
import {Schema} from './Image.schema';

const FALLBACK_ASPECT_RATIO = '16 / 9';

export function Image({cms}: {cms: ImageProps}) {
  const {content, image, section} = cms;
  const {
    alt,
    aspectDesktop,
    aspectMobile,
    imageDesktop,
    imageMobile,
    positionDesktop,
    positionMobile,
  } = {
    ...image,
  };
  const {caption, link} = {...content};
  const {maxWidth, enablePadding} = {...section};

  const sizes = useMemo(() => {
    return /[0-9]+(?:px)|[0-9]+(?:rem)/.exec(maxWidth)?.[0] || '100vw';
  }, [maxWidth]);

  const desktopAspectRatioClass =
    aspectDesktop === 'native' ? '' : aspectDesktop;
  const desktopAspectRatioStyle =
    aspectDesktop === 'native'
      ? {
          aspectRatio: imageDesktop?.aspectRatio || FALLBACK_ASPECT_RATIO,
        }
      : {};
  const mobileAspectRatioClass = aspectMobile === 'native' ? '' : aspectMobile;
  const mobileAspectRatioStyle =
    aspectMobile === 'native'
      ? {
          aspectRatio: imageMobile?.aspectRatio || FALLBACK_ASPECT_RATIO,
        }
      : {};

  return (
    <div
      className={`py-4 md:py-6 lg:py-8 ${enablePadding ? 'px-contained' : ''}`}
    >
      <Link
        aria-label={link?.text}
        className={`mx-auto ${maxWidth}`}
        to={link?.url}
        newTab={link?.newTab}
        type={link?.type}
      >
        <div
          className={`relative bg-offWhite md:hidden ${mobileAspectRatioClass}`}
          style={mobileAspectRatioStyle}
        >
          {imageMobile?.src && (
            <ShopifyImage
              data={{
                altText: alt || image.altText,
                url: imageMobile.src,
              }}
              className={`media-fill ${positionMobile}`}
              sizes={sizes}
            />
          )}
        </div>

        <div
          className={`relative hidden bg-offWhite md:block ${desktopAspectRatioClass}`}
          style={desktopAspectRatioStyle}
        >
          {imageDesktop?.src && (
            <ShopifyImage
              data={{
                altText: alt || image.altText,
                url: imageDesktop.src,
              }}
              className={`media-fill ${positionDesktop}`}
              sizes={sizes}
            />
          )}
        </div>
      </Link>

      {caption && (
        <div className={`mt-3 ${enablePadding ? '' : 'px-contained'}`}>
          <div
            className={`mx-auto [&_a]:underline [&_h1]:text-base [&_h2]:text-base [&_h3]:text-base [&_h4]:text-base [&_h5]:text-base [&_h6]:text-base [&_p]:text-base ${maxWidth}`}
          >
            <Markdown>{caption}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

Image.displayName = 'Image';
Image.Schema = Schema;
