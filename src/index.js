import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: 'https://tweetle-server-xpaq.vercel.app/', // Your GraphQL endpoint
});

// // ngrok
// const httpLink = createHttpLink({
//   uri: 'https://be53-67-1-144-50.ngrok-free.app/', // Your GraphQL endpoint
// });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
