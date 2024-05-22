import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

function LikeComponent({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(err) {
      console.error(err);
    },
  });

  const likeHandler = () => {
    if (user) {
      likePost();
    }
  };

  const likeButton = user ? (
    liked ? (
      <button className="ui button" onClick={likeHandler}>
        <i className="heart black icon"></i> Liked
      </button>
    ) : (
      <button className="ui violet button" onClick={likeHandler}>
        <i className="heart icon"></i> Like
      </button>
    )
  ) : (
    <Link to="/login" className="ui black button">
      <i className="heart icon"></i> Like
    </Link>
  );

  return (
    <div className="ui labeled button right floated">
      {likeButton}
      <a className="ui basic violet left pointing label" href="/">
        {likeCount}
      </a>
    </div>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeComponent;
