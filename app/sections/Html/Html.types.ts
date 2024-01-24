interface Content {
  contentAlign?: string;
  textAlign?: string;
}

interface Section {
  hasXPadding?: boolean;
  hasYPadding?: boolean;
  maxWidth?: string;
}

export interface HtmlProps {
  content?: Content;
  html?: string;
  section?: Section;
}
