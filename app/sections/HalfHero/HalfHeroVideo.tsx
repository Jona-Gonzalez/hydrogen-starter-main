// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/media-has-caption */
import {useEffect, useRef, useState} from 'react';
import {useInView} from 'react-intersection-observer';

import {HalfHeroVideoProps} from './HalfHero.types';
import {Svg} from '~/components';

export function HalfHeroVideo({
  autoplay,
  posterSrc,
  sound,
  videoAlt,
  videoSrc,
}: HalfHeroVideoProps) {
  const videoRef = useRef(null);
  const {ref, inView} = useInView({
    rootMargin: '0px',
    triggerOnce: true,
  });

  const [isPlaying, setIsPlaying] = useState(null);

  useEffect(() => {
    if (autoplay || isPlaying === null || sound || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [autoplay, isPlaying, sound]);

  return (
    <div ref={ref} className="absolute inset-0 h-full w-full">
      <video
        autoPlay={autoplay}
        className="h-full w-full object-cover"
        controls={!autoplay && sound}
        loop={autoplay || !sound}
        muted={autoplay || !sound}
        playsInline
        poster={posterSrc}
        ref={videoRef}
      >
        {inView && videoSrc && <source src={videoSrc} type="video/mp4" />}
      </video>

      {!autoplay && !sound && (
        <button
          aria-label={`Play video for ${videoAlt}`}
          className={`group absolute inset-0 h-full w-full transition md:hover:bg-transparent ${
            !isPlaying ? 'bg-[rgba(0,0,0,0.2)]' : ''
          }`}
          onClick={() => setIsPlaying(!isPlaying)}
          type="button"
        >
          {!isPlaying && (
            <Svg
              className="absolute left-1/2 top-1/2 w-12 -translate-x-1/2 -translate-y-1/2 text-white opacity-90 transition group-hover:opacity-100 xs:w-16 lg:w-20"
              src="/svgs/play.svg#play"
              title="Play"
              viewBox="0 0 24 24"
            />
          )}
        </button>
      )}
    </div>
  );
}

HalfHeroVideo.displayName = 'HalfHeroVideo';
