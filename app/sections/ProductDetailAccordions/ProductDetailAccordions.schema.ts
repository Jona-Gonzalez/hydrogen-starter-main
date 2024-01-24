import {COLORS} from '~/settings/common';

export function Schema({template}) {
  if (template !== 'product') return null;

  return {
    category: 'Product',
    label: 'Product Detail Accordions',
    key: 'product-detail-accordions',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/product-detail-accordions-preview.jpg?v=1676403778',
    fields: [
      {
        label: 'Accordions',
        name: 'accordions',
        component: 'group-list',
        itemProps: {
          label: '{{item.header}}',
        },
        fields: [
          {
            label: 'Header',
            name: 'header',
            component: 'text',
          },
          {
            label: 'Body',
            name: 'body',
            component: 'markdown',
          },
          {
            label: 'Default Open',
            name: 'defaultOpen',
            component: 'toggle',
            description: 'Sets accordion to be open by default',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: [
          {
            header: 'Sizing',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            defaultOpen: false,
          },
          {
            header: 'Care',
            body: `* Lorem ipsum dolor sit amet\n* Consectetur adipiscing elit\n* Sed do eiusmod tempor`,
            defaultOpen: false,
          },
        ],
        defaultItem: {
          header: 'Details',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          defaultOpen: false,
        },
      },
      {
        label: 'Accordion Header Background Color',
        name: 'headerBgColor',
        component: 'select',
        options: COLORS,
        defaultValue: 'var(--off-white)',
      },
      {
        label: 'Accordion Header Text Color',
        name: 'headerTextColor',
        component: 'select',
        options: COLORS,
        defaultValue: 'var(--text)',
      },
    ],
  };
}
