import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../utils/graphql";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      console.log("Post deleted successfully");
      setConfirmOpen(false);
      if (!commentId) {
        // Remove post from cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        // Create a new object with the updated posts list
        const newData = {
          ...data,
          getPosts: data.getPosts.filter((post) => post.id !== postId),
        };

        // Write the new data back to the cache
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
      }
      if (callback) callback();
    },
    variables: {
      postId: postId,
      commentId: commentId,
    },
  });

  return (
    <>
      <div className="extra content">
        <div
          className="ui basic red button floated right"
          onClick={() => setConfirmOpen(true)}
        >
          Delete
        </div>
      </div>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
