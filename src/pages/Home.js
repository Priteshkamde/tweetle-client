import React, { useContext } from "react";
import { useQuery } from "@apollo/client";

import { AuthContext } from "../context/auth";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { Transition } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  if (loading) return <h1>Loading posts...</h1>;
  if (data) {
    const { getPosts: posts } = data;
    // console.log(posts);

    return (
      <div>
        <h1>Recent Posts</h1>
        {user && (
          <div>
            <PostForm />
          </div>
        )}

        <Transition.Group>
          {posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
        </Transition.Group>
        <div className="ui hidden divider"></div>
      </div>
    );
  }

  return null; // Handle case where data is not available or no posts are returned
}

export default Home;
