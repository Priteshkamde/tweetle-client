import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../context/auth"; // Import the AuthContext
import { useForm } from "../utils/CustomHooks";

function Login(props) {
  const context = useContext(AuthContext); // Use the AuthContext
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      console.log(result.data.login);
      context.login(result.data.login); // Call the login function from the AuthContext
      navigate("/");
    },
    onError(err) {
      console.error("Error occurred:", err);

      if (err.graphQLErrors.length > 0) {
        const graphQLError = err.graphQLErrors[0];
        if (graphQLError.extensions && graphQLError.extensions.errors) {
          console.log("GraphQL Errors:", graphQLError.extensions.errors);
          setErrors(graphQLError.extensions.errors);
        } else {
          console.log("General Error:", graphQLError.message);
          setErrors({ general: graphQLError.message });
        }
      }
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        {/* <h1>Login</h1> */}
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
