/* eslint-disable react/jsx-props-no-spreading */
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Layout from '../components/layout/Layout';

const GlobalStyle = createGlobalStyle`
  body {
    border:1px solid red;
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    background-color: gray;
  }
`;

const theme = {
  colors: {
    primary: '#0070f3',
  },
};

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}
