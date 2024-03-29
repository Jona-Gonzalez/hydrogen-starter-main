import {OBJECT_POSITIONS} from '~/settings/common';

export function Schema() {
  return {
    category: 'Media',
    label: 'Image',
    key: 'image',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/image-preview.jpg?v=1675730321',
    fields: [
      {
        label: 'Image Settings',
        name: 'image',
        component: 'group',
        description: 'Image, aspect ratio, image position',
        fields: [
          {
            label: 'Image Alt',
            name: 'alt',
            component: 'text',
            description: 'Brief description of image',
          },
          {
            label: 'Image (tablet/desktop)',
            name: 'imageDesktop',
            component: 'image',
          },
          {
            label: 'Image Aspect Ratio (tablet/desktop)',
            name: 'aspectDesktop',
            component: 'select',
            options: [
              {label: 'Native Aspect Ratio', value: 'native'},
              {label: '3:1', value: 'md:aspect-[3/1]'},
              {label: '5:2', value: 'md:aspect-[5/2]'},
              {label: '2:1', value: 'md:aspect-[2/1]'},
              {label: '16:9', value: 'md:aspect-[16/9]'},
              {label: '3:2', value: 'md:aspect-[3/2]'},
              {label: '4:3', value: 'md:aspect-[4/3]'},
              {label: '5:4', value: 'md:aspect-[5/4]'},
              {label: '1:1', value: 'md:aspect-[1/1]'},
              {label: '4:5', value: 'md:aspect-[4/5]'},
              {label: '3:4', value: 'md:aspect-[3/4]'},
              {label: '2:3', value: 'md:aspect-[2/3]'},
              {label: '9:16', value: 'md:aspect-[9/16]'},
            ],
          },
          {
            label: 'Image Position (tablet/desktop)',
            name: 'positionDesktop',
            component: 'select',
            options: OBJECT_POSITIONS.desktop,
          },
          {
            label: 'Image (mobile)',
            name: 'imageMobile',
            component: 'image',
          },
          {
            label: 'Image Aspect Ratio (mobile)',
            name: 'aspectMobile',
            component: 'select',
            options: [
              {label: 'Native Aspect Ratio', value: 'native'},
              {label: '3:1', value: 'aspect-[3/1]'},
              {label: '5:2', value: 'aspect-[5/2]'},
              {label: '2:1', value: 'aspect-[2/1]'},
              {label: '16:9', value: 'aspect-[16/9]'},
              {label: '3:2', value: 'aspect-[3/2]'},
              {label: '4:3', value: 'aspect-[4/3]'},
              {label: '5:4', value: 'aspect-[5/4]'},
              {label: '1:1', value: 'aspect-[1/1]'},
              {label: '4:5', value: 'aspect-[4/5]'},
              {label: '3:4', value: 'aspect-[3/4]'},
              {label: '2:3', value: 'aspect-[2/3]'},
              {label: '9:16', value: 'aspect-[9/16]'},
            ],
          },
          {
            label: 'Image Position (mobile)',
            name: 'positionMobile',
            component: 'select',
            options: OBJECT_POSITIONS.mobile,
          },
        ],
        defaultValue: {
          alt: 'Rack of green t-shirts',
          imageDesktop: {
            src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
          },
          aspectDesktop: 'native',
          positionDesktop: 'md:object-center',
          imageMobile: {
            src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
          },
          aspectMobile: 'native',
          positionMobile: 'object-center',
        },
      },
      {
        label: 'Content Settings',
        name: 'content',
        component: 'group',
        description: 'Link, caption',
        fields: [
          {
            label: 'Link',
            name: 'link',
            component: 'link',
            description: 'Optional link to make image clickable',
          },
          {
            label: 'Caption',
            name: 'caption',
            component: 'markdown',
            description: 'Optional caption below image',
          },
        ],
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Max width, horizontal padding',
        fields: [
          {
            label: 'Max Width',
            name: 'maxWidth',
            component: 'select',
            options: [
              {
                label: 'Narrow',
                value: 'max-w-[30rem]',
              },
              {
                label: 'Medium Narrow',
                value: 'max-w-[45rem]',
              },
              {
                label: 'Medium',
                value: 'max-w-[60rem]',
              },
              {
                label: 'Medium Wide',
                value: 'max-w-[75rem]',
              },
              {
                label: 'Wide',
                value: 'max-w-[90rem]',
              },
              {label: 'Full', value: 'max-w-full'},
            ],
          },
          {
            label: 'Enable Horizontal Padding',
            name: 'enablePadding',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          maxWidth: 'max-w-[90rem]',
          enablePadding: true,
        },
      },
    ],
  };
}
