export function Schema({handle}) {
  if (handle !== 'search') return null;

  return {
    category: 'Search',
    label: 'Search Results',
    key: 'search-results',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/search-results-preview.jpg?v=1675732833',
    fields: [],
  };
}
