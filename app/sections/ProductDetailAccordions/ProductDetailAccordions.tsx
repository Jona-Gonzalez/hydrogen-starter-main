import {ProductDetailAccordion} from './ProductDetailAccordion';
import {ProductDetailAccordionsProps} from './ProductDetailAccordions.types';
import {Schema} from './ProductDetailAccordions.schema';

export function ProductDetailAccordions({
  cms,
}: {
  cms: ProductDetailAccordionsProps;
}) {
  const {accordions, headerBgColor, headerTextColor} = cms;

  return accordions?.length ? (
    <ul className="grid grid-cols-1 gap-4">
      {accordions.map((accordion, index) => {
        return (
          <li key={index}>
            <ProductDetailAccordion
              accordion={accordion}
              headerBgColor={headerBgColor}
              headerTextColor={headerTextColor}
            />
          </li>
        );
      })}
    </ul>
  ) : null;
}

ProductDetailAccordions.displayName = 'ProductDetailAccordions';
ProductDetailAccordions.Schema = Schema;
