import PropTypes from 'prop-types';
import {Image} from '@shopify/hydrogen-react';

import {Link, Svg} from '~/components';

interface ThreeTilesTileProps {
  aspectRatio: string;
  item: Record<string, any>;
  textColor: string;
}

export function ThreeTilesTile({
  aspectRatio = 'aspect-[3/4]',
  item,
  textColor,
}: ThreeTilesTileProps) {
  return (
    <div className="w-full" style={{color: textColor}}>
      <div className={`relative mb-4 bg-offWhite ${aspectRatio}`}>
        <Link
          aria-label={item.heading}
          to={item.link?.url}
          newTab={item.link?.newTab}
          tabIndex="-1"
          type={item.link?.type}
        >
          {item.image?.src && (
            <Image
              data={{
                altText: item.alt,
                url: item.image.src,
              }}
              className={`media-fill ${item.position}`}
              sizes="(min-width: 1440px) 1200px, (min-width: 768px) 50vw, 100vw"
            />
          )}
        </Link>
      </div>

      <div className="inset-0 flex h-full w-full flex-col items-start gap-4">
        <Link
          aria-label={item.heading}
          to={item.link?.url}
          newTab={item.link?.newTab}
          type={item.link?.type}
        >
          <div className="group flex">
            <h2 className="text-xl lg:text-2xl">{item.heading}</h2>

            <span className="ml-[0.75rem] block max-w-[1.25rem] transition-transform lg:group-hover:translate-x-2">
              <Svg
                src="/svgs/arrow-right.svg#arrow-right"
                title="Arrow"
                viewBox="0 0 24 24"
              />
            </span>
          </div>
        </Link>

        {item.description && <p>{item.description}</p>}

        {item.link?.text && (
          <div>
            <Link
              aria-label={item.link.text}
              className="text-label text-main-underline"
              to={item.link.url}
              newTab={item.link.newTab}
              tabIndex="-1"
              type={item.link.type}
            >
              {item.link.text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

ThreeTilesTile.displayName = 'ThreeTilesTile';
ThreeTilesTile.propTypes = {
  aspectRatio: PropTypes.string,
  item: PropTypes.object,
  textColor: PropTypes.string,
};
