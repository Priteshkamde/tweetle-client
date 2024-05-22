import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeComponent from "../components/LikeComponent";
import DeleteButton from "../components/DeleteButton.js";

function SinglePost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [comment, setComment] = useState("");

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update(proxy, result) {
      setComment('');
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY,
        variables: { postId },
      });

      const newData = {
        ...data,
        getPost: {
          ...data.getPost,
          comments: [result.data.createComment, ...data.getPost.comments],
          commentCount: data.getPost.commentCount + 1,
        },
      };

      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        variables: { postId },
        data: newData,
      });
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const deletePostCallback = () => {
    navigate("/");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitComment();
  };

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <div>
        <div className="ui fluid card">
          <div className="content">
            <span style={{ fontWeight: "bold" }}>{username}</span>
            <div className="right floated meta">
              {moment(createdAt).fromNow(true)}
            </div>
          </div>
          <div className="description">{body}</div>
          <div className="extra content">
            <LikeComponent user={user} post={{ id, likes, likeCount }} />
            <Link to={`/posts/${id}`} className="content">
              <div className="ui labeled button">
                <div className="ui black button">
                  <i className="comments icon"></i> Comments
                </div>
                <a className="ui basic left pointing black label" href="/">
                  {commentCount}
                </a>
              </div>
            </Link>
            {user && user.username === username && (
              <DeleteButton postId={id} callback={deletePostCallback} />
            )}
          </div>
        </div>

        {user && <div className="ui hidden divider"></div>}

        {user && (
          <div className="ui comments">
            <div className="comment">
              <div className="content">
                <form className="ui form" onSubmit={handleSubmit}>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="comment"
                      name="comment"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="ui button teal"
                    disabled={comment.trim() === ""}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {user && <div className="ui hidden divider"></div>}

        {comments.map((comment) => (
          <div key={comment.id}>
            {user && user.username === comment.username && (
              <DeleteButton postId={id} commentId={comment.id} />
            )}
            <div className="ui comments">
              <div className="comment">
                <div className="content">
                  <span style={{ fontWeight: "bold" }}>{comment.username}</span>
                  <div className="metadata">
                    {moment(comment.createdAt).fromNow(true)}
                  </div>
                  <div className="text">{comment.body}</div>
                </div>
              </div>
            </div>
            <div className="ui hidden divider"></div>
          </div>
        ))}

        <div className="ui hidden divider"></div>
      </div>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
        createdAt
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
