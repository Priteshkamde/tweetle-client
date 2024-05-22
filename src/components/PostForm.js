import React from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useForm } from "../utils/CustomHooks";
import { useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function PostForm() {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      try {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const newPost = result.data.createPost;
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            ...data,
            getPosts: [newPost, ...data.getPosts],
          },
        });
        values.body = "";
      } catch (err) {
        console.error(err);
      }
    },
    onError(err) {
      console.error(err);
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        createdAt
        username
      }
      likeCount
      comments {
        id
        createdAt
        username
        body
      }
      commentCount
    }
  }
`;

export default PostForm;
