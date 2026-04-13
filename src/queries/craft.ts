// ---------------------------------------------------------------------------
// Craft CMS GraphQL query strings
// Adjust field names to match your Craft schema (entry types, field handles).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

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
`

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

export const HOME_QUERY = /* GraphQL */ `
  query Home {
    entry(section: "home") {
      id
      title
      uri
      ... on home_Entry {
        text { html }
      }
    }
  }
`


