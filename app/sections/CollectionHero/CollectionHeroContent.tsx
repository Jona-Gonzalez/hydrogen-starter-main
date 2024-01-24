import {useMemo} from 'react';

import {CollectionHeroContentProps} from './CollectionHero.types';

export function CollectionHeroContent({
  content,
  text,
}: CollectionHeroContentProps) {
  const {color, heading, subheading} = {...text};
  const {
    alignmentMobile,
    alignmentDesktop,
    darkOverlay,
    maxWidthMobile,
    maxWidthDesktop,
    positionMobile,
    positionDesktop,
  } = {
    ...content,
  };
  const alignmentClasses = `${alignmentMobile} ${alignmentDesktop}`;
  const positionClasses = `${positionMobile} ${positionDesktop}`;
  const maxWidthContentClasses = `${maxWidthMobile} ${maxWidthDesktop}`;
  const darkOverlayClass = darkOverlay ? 'bg-[rgba(0,0,0,0.2)]' : '';

  const headingWithBreaks = useMemo(() => {
    const splitHeading = heading?.split('\n');
    if (splitHeading?.length === 1) return heading;
    return splitHeading?.reduce((acc: any[], line, index, arr) => {
      acc.push(<span key={index}>{line}</span>);
      if (index < arr.length - 1) acc.push(<br key={`br${index}`} />);
      return acc;
    }, []);
  }, [heading]);

  return (
    <div
      className={`pointer-events-none relative flex h-full w-full p-4 md:p-8 xl:p-12 ${positionClasses} ${darkOverlayClass}`}
    >
      <div
        className={`pointer-events-auto flex flex-col ${alignmentClasses} ${maxWidthContentClasses}`}
        style={{color}}
      >
        <h1 className="text-title-h1">{headingWithBreaks}</h1>

        {subheading && <p>{subheading}</p>}
      </div>
    </div>
  );
}

CollectionHeroContent.displayName = 'CollectionHeroContent';
