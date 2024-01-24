import {Accordion} from './Accordion';
import {AccordionsProps} from './Accordions.types';
import {Schema} from './Accordions.schema';

export function Accordions({cms}: {cms: AccordionsProps}) {
  const {accordions, heading, headerBgColor, headerTextColor} = cms;

  return (
    <div className="px-contained my-4 md:my-8 xl:my-12">
      <div className="mx-auto max-w-[50rem]">
        {!!heading && (
          <h2 className="text-title-h2 mb-4 text-center">{heading}</h2>
        )}

        <ul className="grid grid-cols-1 gap-4">
          {accordions?.map((accordion, index) => {
            return (
              <li key={index}>
                <Accordion
                  accordion={accordion}
                  headerBgColor={headerBgColor}
                  headerTextColor={headerTextColor}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Accordions.displayName = 'Accordions';
Accordions.Schema = Schema;
