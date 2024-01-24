export function Schema() {
  return {
    category: 'Slider',
    label: 'Products Slider',
    key: 'metaobject-products-slider',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/products-slider-preview.jpg?v=1675730335',
    dataSource: {
      source: 'shopify',
      type: 'metaobject',
      reference: {
        type: 'products_slider',
      },
    },
    fields: [],
  };
}
