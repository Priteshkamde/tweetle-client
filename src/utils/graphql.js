import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      comments {
        id
        createdAt
        username
        body
      }
      id
      body
      likeCount
      commentCount
      createdAt
      likes {
        createdAt
        id
        username
      }
      username
    }
  }
`;
