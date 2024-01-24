import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';
import PropTypes from 'prop-types';

export function Badges({
  className,
  isDraft, // in customizer, badge added to indicate product is draft
  tags,
}) {
  const siteSettings = useSiteSettings();
  const {badgeColors} = {...siteSettings?.settings?.product?.badges};

  const badgeColorsMap = useMemo(() => {
    if (!badgeColors) return {};
    return badgeColors.reduce((acc, badge) => {
      return {...acc, [badge.tag?.trim()]: badge};
    }, {});
  }, [badgeColors]);

  const badges = useMemo(() => {
    return tags.reduce(
      (acc, tag) => {
        if (tag.startsWith('badge::')) {
          const value = tag.split('badge::')[1]?.trim();
          if (!value) return acc;
          return [...acc, value];
        }
        return acc;
      },
      isDraft ? ['Draft'] : [],
    );
  }, [isDraft, tags]);

  return (
    <div
      className={`text-label flex flex-wrap gap-2.5 xs:gap-3 [&_div]:rounded [&_div]:px-2 [&_div]:py-1 ${className}`}
    >
      {badges?.map((badge, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: badgeColorsMap[badge]?.bgColor || 'var(--black)',
              color: badgeColorsMap[badge]?.textColor || 'var(--white)',
            }}
          >
            {badge}
          </div>
        );
      })}
    </div>
  );
}

Badges.displayName = 'Badges';
Badges.defaultProps = {
  className: '',
  isDraft: false,
  tags: [],
};
Badges.propTypes = {
  className: PropTypes.string,
  isDraft: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
};
