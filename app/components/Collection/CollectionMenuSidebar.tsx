import {useEffect} from 'react';

import {Svg} from '~/components';
import {useBodyScrollLock} from '~/hooks';

export function CollectionMenuSidebar({children, isOpen, setIsOpen, title}) {
  const {lockBodyScroll, unlockBodyScroll} = useBodyScrollLock();

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }, [isOpen]);

  return (
    <div
      className={`${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } position fixed inset-0 z-[100] flex h-full w-full flex-col bg-white transition md:!hidden`}
    >
      {isOpen && (
        <>
          <div className="relative grid h-14 grid-cols-[4rem_1fr_4rem] items-center justify-center gap-4 border-b border-border px-4">
            <div>
              <button
                className=""
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <Svg
                  className="max-w-[1.25rem] text-black"
                  src="/svgs/arrow-left.svg#arrow-left"
                  title="Arrow Left"
                  viewBox="0 0 24 24"
                />
              </button>
            </div>

            <h2 className="text-center text-lg">{title}</h2>

            <div className="flex justify-end" />
          </div>

          <div className="scrollbar-hide relative flex-1 overflow-y-auto">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

CollectionMenuSidebar.displayName = 'CollectionMenuSidebar';
