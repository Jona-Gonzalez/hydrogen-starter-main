import {useEffect, useState} from 'react';
import {useLoaderData} from '@remix-run/react';

import {BlogGridItem} from './BlogGridItem';
import {BlogPageQueried} from '~/lib/types';
import {Schema} from './BlogGrid.schema';

export function BlogGrid() {
  const {blog} = useLoaderData<{blog: BlogPageQueried}>();

  const [filteredArticles, setFilteredArticles] = useState(
    blog?.articles?.nodes,
  );

  const categoryParam = '';

  useEffect(() => {
    if (categoryParam) {
      const filtered = blog?.articles?.nodes?.filter(
        ({category}: {category: string}) => {
          return (
            category?.toLowerCase().trim() ===
            categoryParam?.toLowerCase().trim()
          );
        },
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(blog?.articles?.nodes);
    }
  }, [blog, categoryParam]);

  return (
    <div className="px-contained py-8 md:py-10 lg:py-12">
      {filteredArticles?.length ? (
        <ul className="mx-auto grid max-w-[var(--content-max-width)] grid-cols-1 gap-x-5 gap-y-8 xs:grid-cols-2 md:grid-cols-3">
          {filteredArticles.map((article) => {
            return (
              <li key={article.id}>
                <BlogGridItem article={article} />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex min-h-[12.5rem] items-center justify-center text-center">
          <p>No posts found under this category.</p>
        </div>
      )}
    </div>
  );
}

BlogGrid.displayName = 'BlogGrid';
BlogGrid.Schema = Schema;
