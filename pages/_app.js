/* eslint-disable react/jsx-props-no-spreading */
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Layout from '../components/layout/Layout';

const GlobalStyle = createGlobalStyle`
 
  body,html {
    margin: 0;
    padding: 0;
    font-size: 16px;
}
* {
    box-sizing: border-box;
}
`;

const theme = {
  colors: {
    primary: '#0070f3',
    primaryDarker: '#6060aa',
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
