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

export const ARTICLE_QUERY = `#graphql
  query Article($handle: String!, $version: Version, $cursor: String) {
    article: articleByHandle(handle: $handle, version: $version) {
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
      blog {
        handle
        title
        description
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
    }
  }
  ${SECTION_FRAGMENT}
`;
