import {TabbedThreeTilesTabsProps} from './TabbedThreeTiles.types';

export function TabbedThreeTilesTabs({
  activeTabIndex,
  maxWidthClass,
  setActiveTabIndex,
  tabs,
  textColor,
}: TabbedThreeTilesTabsProps) {
  return (
    <div
      className={`mx-auto ${maxWidthClass} mb-6 flex justify-center border-b border-border md:mb-10`}
    >
      <div className="scrollbar-hide overflow-x-auto px-4">
        <ul className="flex gap-4 xs:gap-8">
          {tabs?.map((tab, index) => {
            return (
              <li key={index}>
                <button
                  aria-label={tab.tabName}
                  className={`before:z-1 text-nav relative flex h-full flex-col whitespace-nowrap pb-3 before:absolute before:bottom-0 before:w-full before:origin-center before:border-b-2 before:border-current before:transition max-xs:pb-2 max-xs:text-xs ${
                    activeTabIndex === index
                      ? 'before:scale-100'
                      : 'before:scale-0'
                  }`}
                  onClick={() => setActiveTabIndex(index)}
                  style={{color: textColor}}
                  type="button"
                >
                  <p>{tab.tabName}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

TabbedThreeTilesTabs.displayName = 'TabbedThreeTilesTabs';
