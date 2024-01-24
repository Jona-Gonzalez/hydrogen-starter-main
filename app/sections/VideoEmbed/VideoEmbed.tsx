import {useInView} from 'react-intersection-observer';

import {Schema} from './VideoEmbed.schema';
import {VideoEmbedProps} from './VideoEmbed.types';

export function VideoEmbed({cms}: {cms: VideoEmbedProps}) {
  const {media, section} = cms;
  const {embed, aspectRatio} = {...media};
  const {maxWidth, enableYPadding, enableXPadding} = {...section};

  const {ref: inViewRef, inView} = useInView({
    rootMargin: '0px',
    triggerOnce: true,
  });

  return (
    <div
      className={`[&_iframe]:!h-full [&_iframe]:!w-full ${
        enableYPadding ? 'py-4 md:py-6 lg:py-8' : ''
      } ${enableXPadding ? 'px-contained' : ''}`}
      ref={inViewRef}
    >
      <div
        className={`mx-auto bg-offWhite ${maxWidth} ${aspectRatio}`}
        dangerouslySetInnerHTML={{__html: inView ? embed : ''}}
      />
    </div>
  );
}

VideoEmbed.displayName = 'VideoEmbed';
VideoEmbed.Schema = Schema;
