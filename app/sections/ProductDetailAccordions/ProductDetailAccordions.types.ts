interface Accordion {
  body: string;
  defaultOpen: boolean;
  header: string;
}

export interface ProductDetailAccordionsProps {
  accordions: Accordion[];
  headerBgColor: string;
  headerTextColor: string;
}

export interface ProductDetailAccordionProps {
  accordion: Accordion;
  headerBgColor: string;
  headerTextColor: string;
}
