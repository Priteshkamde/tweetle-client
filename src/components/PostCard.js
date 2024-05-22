import React, { useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import LikeComponent from "./LikeComponent";

function PostCard({ post }) {
  const { body, createdAt, id, username, likeCount, commentCount, likes } =
    post;
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="ui fluid card">
        <div className="content">
          <span style={{ fontWeight: "bold" }}>{username}</span>
          <div className="right floated meta">
            {moment(createdAt).fromNow(true)}
          </div>
        </div>
        <Link to={`/posts/${id}`} className="content">
          <div className="description">{body}</div>
        </Link>
        <div className="extra content">
          <LikeComponent
            user={user}
            post={{ id, likes, likeCount }}
          ></LikeComponent>
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
        </div>
      </div>
      <div className="ui hidden divider"></div>
    </div>
  );
}

export default PostCard;
