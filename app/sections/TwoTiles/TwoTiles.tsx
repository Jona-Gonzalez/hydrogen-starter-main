import {Image} from '@shopify/hydrogen-react';

import {Link, Svg} from '~/components';
import {Schema} from './TwoTiles.schema';
import {TwoTilesProps} from './TwoTiles.types';

export function TwoTiles({cms}: {cms: TwoTilesProps}) {
  const {section, tiles} = cms;
  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <div className="px-contained py-contained">
      <div
        className={`${maxWidthClass} mx-auto grid gap-x-5 gap-y-5 md:grid-cols-2 lg:gap-x-8`}
      >
        {tiles?.slice(0, 2).map((item, index) => {
          return (
            <div key={index} className="w-full">
              <div
                className={`relative mb-4 bg-offWhite ${section?.aspectRatio}`}
              >
                <Link
                  aria-label={item.heading}
                  to={item.link?.url}
                  newTab={item.link?.newTab}
                  tabIndex="-1"
                  type={item.link?.type}
                >
                  {item?.image?.src && (
                    <Image
                      data={{
                        altText: item.alt,
                        url: item.image.src,
                      }}
                      className={`media-fill ${item.position}`}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  )}
                </Link>
              </div>

              <div className="flex flex-col items-start">
                <Link
                  aria-label={item.heading}
                  to={item.link?.url}
                  newTab={item.link?.newTab}
                  type={item.link?.type}
                >
                  <div className="group flex">
                    <h3 className="text-2xl lg:text-3xl">{item.heading}</h3>

                    <span className="ml-[0.75rem] block max-w-[1.25rem] transition-transform lg:w-[1.5rem] lg:group-hover:translate-x-2">
                      <Svg
                        src="/svgs/arrow-right.svg#arrow-right"
                        title="Arrow"
                        viewBox="0 0 24 24"
                      />
                    </span>
                  </div>
                </Link>

                {item.description && (
                  <p className="mt-1 text-base">{item.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

TwoTiles.displayName = 'TwoTiles';
TwoTiles.Schema = Schema;
