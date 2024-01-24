import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {Svg} from '~/components';

export function Select({
  onSelect = () => {},
  options = [], // [{ label: 'label', value: 'value' }]
  placeholder,
  placeholderClass,
  selectedOption, // { label: 'label', value: 'value' }
}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const outsideClickHandler = (e) => {
      if (!ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', outsideClickHandler);
    } else {
      document.removeEventListener('click', outsideClickHandler);
    }
    return () => {
      document.removeEventListener('click', outsideClickHandler);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        aria-label="Open account menu"
        className="flex h-12 w-full items-center justify-between gap-4 rounded-full border border-border py-3 px-5 text-base"
        onClick={() => {
          if (options.length) setIsOpen(!isOpen);
        }}
        type="button"
      >
        <p
          className={`${
            selectedOption ? 'text-text' : placeholderClass || 'text-mediumDarkGray'
          }`}
        >
          {selectedOption?.label || placeholder}
        </p>

        <Svg
          className={`w-4 text-text ${isOpen ? 'rotate-180' : ''}`}
          src="/svgs/chevron-down.svg#chevron-down"
          title="Chevron"
          viewBox="0 0 24 24"
        />
      </button>

      <div
        className={`absolute top-[calc(100%+0.5rem)] left-0 z-10 w-full rounded-[0.5rem] border border-gray bg-background text-base transition duration-100 ${
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        <ul className="flex max-h-[18rem] flex-col gap-0 overflow-y-auto py-2">
          {options.map((option, index) => {
            const isActive = option.value === selectedOption?.value;
            return (
              <li key={index} className="flex">
                <button
                  aria-hidden={isOpen ? 'true' : 'false'}
                  className={`w-full py-1.5 px-5 text-left transition md:hover:bg-offWhite ${
                    isActive ? 'bg-lightGray' : 'bg-transparent'
                  }`}
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  tabIndex={isOpen ? '0' : '-1'}
                  type="button"
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Select.displayname = 'Select';
Select.propTypes = {
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  placeholderClass: PropTypes.string,
  selectedOption: PropTypes.object,
};
