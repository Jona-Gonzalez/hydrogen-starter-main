import {Fragment, useState} from 'react';

import {Link, ThreeTilesRow} from '~/components';
import {Schema} from './TabbedThreeTiles.schema';
import {TabbedThreeTilesTabs} from './TabbedThreeTilesTabs';
import {TabbedThreeTilesProps} from './TabbedThreeTiles.types';

export function TabbedThreeTiles({cms}: {cms: TabbedThreeTilesProps}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const {button, heading, section, tabs} = cms;
  const {aspectRatio, bgColor, fullWidth, textColor} = {...section};
  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <div
      className="lg:px-contained py-contained"
      style={{backgroundColor: bgColor}}
    >
      {heading && (
        <h2
          className="text-title-h2 mb-6 px-4 text-center md:mb-10"
          style={{color: textColor}}
        >
          {heading}
        </h2>
      )}

      <div className="mx-auto">
        <TabbedThreeTilesTabs
          activeTabIndex={activeTabIndex}
          maxWidthClass={maxWidthClass}
          setActiveTabIndex={setActiveTabIndex}
          tabs={tabs}
          textColor={textColor}
        />

        {tabs?.length > 0 &&
          tabs.map(({tiles}, index) => {
            if (index !== activeTabIndex) return null;
            return (
              <Fragment key={index}>
                <ThreeTilesRow
                  aspectRatio={aspectRatio}
                  maxWidthClass={maxWidthClass}
                  textColor={textColor}
                  tiles={tiles}
                />
              </Fragment>
            );
          })}
      </div>

      {button?.text && (
        <div className="mt-10 flex flex-col items-center">
          <Link
            aria-label={button.text}
            className={`${section?.buttonStyle || 'btn-primary'}`}
            to={button.url}
            newTab={button.newTab}
            type={button.type}
          >
            {button.text}
          </Link>
        </div>
      )}
    </div>
  );
}

TabbedThreeTiles.displayName = 'TabbedThreeTiles';
TabbedThreeTiles.Schema = Schema;
