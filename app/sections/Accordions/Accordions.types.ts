interface Accordion {
  body: string;
  defaultOpen: boolean;
  header: string;
}

export interface AccordionProps {
  accordion: Accordion;
  headerBgColor: string;
  headerTextColor: string;
}

export interface AccordionsProps {
  accordions: Accordion[];
  heading?: string;
  headerBgColor: string;
  headerTextColor: string;
}
