import {useCallback, useEffect, useState} from 'react';
import Fuse from 'fuse.js';

// info on further search index options: https://fusejs.io/api/options.html

export function useSearchCollectionResults({
  enabled = true,
  mounted = true,
  term,
}: {
  enabled: boolean;
  mounted: boolean;
  term: string;
}) {
  const [collectionsFuse, setCollectionsFuse] = useState(null);
  const [collectionResults, setCollectionResults] = useState(null);

  const setCollectionsFuseOnMount = useCallback(async () => {
    try {
      if (collectionsFuse) return;
      return;
      const response = await fetch('/json/collections-list.json');
      const list = await response.json();
      setCollectionsFuse(
        new Fuse(list, {
          keys: ['title'],
          ignoreLocation: true,
          minMatchCharLength: 3,
          threshold: 0.3,
        }),
      );
    } catch (error) {
      console.error(error.message);
    }
  }, [collectionsFuse]);

  const searchCollectionsOnTermChange = useCallback(() => {
    if (!collectionsFuse) return;
    if (!term) {
      setCollectionResults([]);
      return;
    }
    const results = collectionsFuse.search(term);
    setCollectionResults(results.map(({item}) => item));
  }, [collectionsFuse, term]);

  useEffect(() => {
    if (!mounted || !enabled) return;
    setCollectionsFuseOnMount();
  }, [enabled, mounted]);

  useEffect(() => {
    searchCollectionsOnTermChange();
  }, [term, collectionsFuse]);

  return {collectionResults};
}
