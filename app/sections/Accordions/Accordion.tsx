import {useState} from 'react';

import {AccordionProps} from './Accordions.types';
import {Markdown, Svg} from '~/components';

export function Accordion({
  accordion,
  headerBgColor,
  headerTextColor,
}: AccordionProps) {
  const {body, defaultOpen, header} = accordion;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        aria-label={`${isOpen ? 'Close' : 'Open'} accordion for ${header}`}
        className="flex min-h-[4rem] w-full items-center justify-between gap-x-4 px-4 py-3 text-left xs:px-6"
        onClick={() => setIsOpen(!isOpen)}
        style={{backgroundColor: headerBgColor, color: headerTextColor}}
        type="button"
      >
        <h3 className="text-title-h6 flex-1">{header}</h3>

        {isOpen ? (
          <Svg
            className="w-4 text-current"
            src="/svgs/minus.svg#minus"
            title="Minus"
            viewBox="0 0 24 24"
          />
        ) : (
          <Svg
            className="w-4 text-current"
            src="/svgs/plus.svg#plus"
            title="Plus"
            viewBox="0 0 24 24"
          />
        )}
      </button>

      <div className={`px-4 py-4 xs:px-6 ${isOpen ? 'block' : 'hidden'}`}>
        <Markdown>{body}</Markdown>
      </div>
    </div>
  );
}

Accordion.displayName = 'Accordion';
