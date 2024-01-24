export interface SectionProps {
  cms: Record<string, any>;
  ['comp-name']: string;
}

export interface ProductCms {
  handle: string;
}

export interface ImageCms {
  altText?: string;
  aspectRatio?: number;
  directory?: string;
  filename?: string;
  format?: string;
  height?: number;
  id?: string;
  previewSrc?: string;
  size?: number;
  src: string;
  type?: string;
  width?: number;
}

export interface LinkCms {
  url: string;
  text: string;
  newTab: boolean;
  isExternal: boolean;
  type: 'isPage' | 'isExternal' | 'isEmail' | 'isPhone';
}

interface SeoQueried {
  title: string;
  description: string;
  image: string;
  keywords: string;
  noFollow: boolean;
  noIndex: boolean;
}

interface SectionQueried {
  id: string;
  title: string;
  status: string;
  data: Record<string, any>;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  parentContentType: string;
}

interface PageInfoQueried {
  hasNextPage: boolean;
  endCursor: string;
}

interface TemplateQueried {
  id: string;
  title: string;
  type: string;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlePageQueried {
  id: string;
  title: string;
  handle: string;
  description: string;
  status: string;
  author: string;
  category: string;
  tags: string;
  excerpt: string;
  bodyHtml: string;
  seo: SeoQueried;
  blog: {
    handle: string;
    title: string;
    description: string;
  };
  sections: {
    node: SectionQueried;
    pageInfo: PageInfoQueried;
  }[];
  template: TemplateQueried;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleQueried {
  id: string;
  title: string;
  handle: string;
  description: string;
  status: string;
  author: string;
  category: string;
  tags: string;
  excerpt: string;
  bodyHtml: string;
  seo: SeoQueried;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPageQueried {
  id: string;
  title: string;
  handle: string;
  description: string;
  status: string;
  seo: SeoQueried;
  sections: {
    node: SectionQueried;
    pageInfo: PageInfoQueried;
  }[];
  template: TemplateQueried;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  articles: {
    nodes: ArticleQueried[];
  };
}
