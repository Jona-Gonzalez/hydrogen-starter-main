import {ReactNode, useMemo} from 'react';
import {Link as RemixLink} from '@remix-run/react';

// Docs: https://remix.run/docs/en/main/components/link

const getValidatedHref = ({
  href,
  type,
}: {
  href: string | undefined | null;
  type: string | undefined | null;
}) => {
  if (!href) return '';
  if (type === 'isPage') {
    return href;
  }
  if (type === 'isExternal') {
    if (href.startsWith('/')) return href;
    let externalHref;
    try {
      externalHref = new URL(href).href;
    } catch (error) {
      externalHref = `https://${href}`;
    }
    return externalHref;
  }
  if (type === 'isEmail') {
    return href.startsWith('mailto:') ? href : `mailto:${href}`;
  }
  if (type === 'isPhone') {
    return href.startsWith('tel:') ? href : `tel:${href}`;
  }
  return href;
};

interface LinkProps {
  children?: ReactNode;
  className?: string;
  draggable?: boolean;
  href?: string | undefined | null;
  isExternal?: boolean;
  newTab?: boolean;
  onClick?: () => void;
  prefetch?: 'none' | 'intent' | 'render' | 'viewport';
  preventScrollReset?: boolean;
  relative?: 'route' | 'path';
  reloadDocument?: boolean;
  replace?: boolean;
  state?: Record<string, string>;
  style?: Record<string, string>;
  tabIndex?: string | number;
  text?: string;
  to?: string | undefined | null;
  type?: 'isPage' | 'isExternal' | 'isEmail' | 'isPhone' | undefined | null;
  url?: string | undefined | null;
}

export const Link = ({
  children,
  className,
  href = '', // html property
  isExternal = false, // cms property
  newTab = false,
  prefetch, // remix property
  preventScrollReset = false, // remix property
  relative, // remix property
  reloadDocument = false, // remix property
  replace = false, // remix property
  state, // remix property
  style,
  text = '', // cms property
  to = '', // remix property
  type = 'isPage', // cms property
  url = '', // cms property
  ...props
}: LinkProps) => {
  const initialHref = to || href || url;

  const finalHref = useMemo(() => {
    return getValidatedHref({
      href: initialHref,
      type: isExternal ? 'isExternal' : type,
    });
  }, [initialHref, isExternal, type]);

  return finalHref ? (
    <RemixLink
      className={className}
      prefetch={prefetch}
      preventScrollReset={preventScrollReset}
      relative={relative}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      style={style}
      to={finalHref}
      {...(newTab ? {target: '_blank'} : null)}
      {...props}
    >
      {children || text}
    </RemixLink>
  ) : (
    <div className={className} style={style} {...props}>
      {children || text}
    </div>
  );
};

Link.displayName = 'Link';
