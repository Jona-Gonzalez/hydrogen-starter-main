import {COLORS} from '~/settings/common';

export function Schema() {
  return {
    category: 'Slider',
    label: 'Press Slider',
    key: 'press-slider',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/press-slider-preview.jpg?v=1675730332',
    fields: [
      {
        label: 'Slides',
        name: 'slides',
        component: 'group-list',
        description: 'Max of 6 slides',
        validate: {
          maxItems: 6,
        },
        itemProps: {
          label: '{{item.quote}}',
        },
        fields: [
          {
            label: 'Alt',
            name: 'alt',
            component: 'text',
            description: 'Brief description of image',
          },
          {
            label: 'Logo',
            name: 'image',
            component: 'image',
            description: 'Recommended png or svg file under 10kb',
          },
          {
            label: 'Quote',
            name: 'quote',
            component: 'textarea',
          },
        ],
        defaultItem: {
          alt: 'Press logo',
          image: {
            src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/forbes-logo-small.png?v=1702422887',
            aspectRatio: 3.8,
          },
          quote:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
        },
        defaultValue: [
          {
            alt: 'Press logo',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/forbes-logo-small.png?v=1702422887',
              aspectRatio: 3.8,
            },
            quote:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
          },
          {
            alt: 'Press logo',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/vanity-fair-logo-small.png?v=1702422889',
              aspectRatio: 4.3,
            },
            quote:
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          },
          {
            alt: 'Press logo',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/forbes-logo-small.png?v=1702422887',
              aspectRatio: 3.8,
            },
            quote:
              'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
          },
          {
            alt: 'Press logo',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/vanity-fair-logo-small.png?v=1702422889',
              aspectRatio: 4.3,
            },
            quote:
              'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
          },
          {
            alt: 'Press logo',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/forbes-logo-small.png?v=1702422887',
              aspectRatio: 3.8,
            },
            quote:
              'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
          },
          {
            alt: 'Press logo',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/vanity-fair-logo-small.png?v=1702422889',
              aspectRatio: 4.3,
            },
            quote:
              'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
          },
        ],
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Full width, background color, text color',
        fields: [
          {
            label: 'Full Width',
            name: 'fullWidth',
            component: 'toggle',
            description: 'Removes max width of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Background Color',
            name: 'bgColor',
            component: 'select',
            options: COLORS,
          },
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
          },
        ],
        defaultValue: {
          fullWidth: false,
          bgColor: 'var(--background)',
          textColor: 'var(--text)',
        },
      },
    ],
  };
}
