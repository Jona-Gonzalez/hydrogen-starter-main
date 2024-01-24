const SECTION_FRAGMENT = `#graphql
  fragment section on Section {
    id
    title
    status
    data
    publishedAt
    createdAt
    updatedAt
    parentContentType
  }
`;

export const BLOG_QUERY = `#graphql
  query Blog($handle: String!, $version: Version, $cursor: String) {
    blog: blogByHandle(handle: $handle, version: $version) {
      id
      title
      handle
      description
      status
      seo {
        title
        description
        image
        keywords
        noFollow
        noIndex
      }
      sections(first: 25, after: $cursor) {
        nodes {
          ...section
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      template {
        id
        title
        type
        status
        publishedAt
        createdAt
        updatedAt
      }
      publishedAt
      createdAt
      updatedAt
      articles(first: 50, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            handle
            description
            status
            author
            category
            tags
            excerpt
            bodyHtml
            seo {
              title
              description
              image
              keywords
              noFollow
              noIndex
            }
            publishedAt
            createdAt
            updatedAt
          }
        }
    }
  }
  ${SECTION_FRAGMENT}
`;
