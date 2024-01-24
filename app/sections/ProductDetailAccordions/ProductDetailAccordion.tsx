import {useState} from 'react';

import {Markdown, Svg} from '~/components';
import {ProductDetailAccordionProps} from './ProductDetailAccordions.types';

export function ProductDetailAccordion({
  accordion,
  headerBgColor,
  headerTextColor,
}: ProductDetailAccordionProps) {
  const {body, defaultOpen, header} = accordion;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        aria-label={`${isOpen ? 'Close' : 'Open'} accordion for ${header}`}
        className="flex h-14 w-full items-center justify-between gap-x-4 p-4"
        onClick={() => setIsOpen(!isOpen)}
        style={{backgroundColor: headerBgColor, color: headerTextColor}}
        type="button"
      >
        <h3 className="text-sm font-bold">{header}</h3>

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

      <div
        className={`px-4 pt-4 [&_h1]:mb-3 [&_h1]:text-sm [&_h2]:mb-3 [&_h2]:text-sm [&_h3]:mb-3 [&_h3]:text-sm [&_h4]:mb-3 [&_h4]:text-sm [&_h5]:mb-3 [&_h5]:text-sm [&_h6]:mb-3 [&_h6]:text-sm [&_ol]:!pl-4 [&_ol]:text-sm [&_p]:mb-3 [&_p]:text-sm [&_ul]:!pl-4 [&_ul]:text-sm ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <Markdown>{body}</Markdown>
      </div>
    </div>
  );
}

ProductDetailAccordion.displayName = 'ProductDetailAccordion';
