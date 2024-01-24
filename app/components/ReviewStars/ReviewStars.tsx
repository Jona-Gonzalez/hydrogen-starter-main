import {useMemo} from 'react';
import PropTypes from 'prop-types';

import {Svg} from '~/components';

export function ReviewStars({
  color = 'var(--text)',
  rating = 0, // 0 - 5
  size = 'large', // small | large
}) {
  const stars = useMemo(() => {
    const fullStar = {
      key: 'star-full',
      label: 'Full Star',
    };
    const emptyStar = {
      key: 'star-empty',
      label: 'Empty Star',
    };
    const halfStar = {
      key: 'star-half-empty',
      label: 'Half Star',
    };

    return [...Array(5).keys()].map((index) => {
      const diff = rating - index;
      if (diff >= 0.75) {
        return fullStar;
      }
      if (diff >= 0.25) {
        return halfStar;
      }
      return emptyStar;
    });
  }, [rating]);

  const classBySize = {
    small: {
      gap: 'gap-0.5',
      width: 'w-3',
    },
    large: {
      gap: 'gap-1',
      width: 'w-4',
    },
  };

  return (
    <ul className={`flex items-center ${classBySize[size]?.gap}`}>
      {stars.map(({key, label}, index) => (
        <li key={index}>
          <Svg
            className={`${classBySize[size]?.width}`}
            src={`/svgs/${key}.svg#${key}`}
            style={{color}}
            title={label}
            viewBox="0 0 24 24"
          />
        </li>
      ))}
    </ul>
  );
}

ReviewStars.displayName = 'ReviewStars';
ReviewStars.propTypes = {
  color: PropTypes.string,
  rating: PropTypes.number,
  size: PropTypes.oneOf(['small', 'large']),
};
