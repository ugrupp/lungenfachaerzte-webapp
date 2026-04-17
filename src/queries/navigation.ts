/** Top-level navigation links from a Craft "navigation" global set. */
export const NAVIGATION_QUERY = /* GraphQL */ `
  query Navigation {
    globalSet(handle: "navigation") {
      ... on navigation_GlobalSet {
        navigation {
          ... on navigation_NodeType {
            title
            url
            newWindow
            children {
              ... on navigation_NodeType {
                title
                url
                newWindow
              }
            }
          }
        }
      }
    }
  }
`;
