import {useState} from 'react';

import {Link, Svg} from '~/components';

export function MobileMenuItem({item}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-b-gray">
      <button
        aria-label={
          isOpen ? `Close ${item.title} menu` : `Open ${item.title} menu`
        }
        className="flex h-14 w-full items-center justify-between px-4 py-4"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <h3 className="text-nav">{item.title}</h3>

        <Svg
          className={`w-4 text-white ${isOpen ? 'rotate-180' : ''}`}
          src="/svgs/chevron-down.svg#chevron-down"
          title="Chevron"
          viewBox="0 0 24 24"
        />
      </button>

      <ul
        className={`flex-col items-start gap-2 px-4 pb-6 ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        {item.links?.map(({link}, linkIndex) => {
          return (
            <li key={linkIndex}>
              <Link
                aria-label={link?.text}
                className="hover-text-underline"
                to={link?.url}
                newTab={link?.newTab}
                type={link?.type}
              >
                {link?.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

MobileMenuItem.displayName = 'MobileMenuItem';
