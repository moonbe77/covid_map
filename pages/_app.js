/* eslint-disable react/jsx-props-no-spreading */
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/layout/Layout';

const queryClient = new QueryClient()

const GlobalStyle = createGlobalStyle`
 
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-family: 'Dosis', sans-serif;
}
* {
    box-sizing: border-box;
}
body{
    font-family: 'Dosis', sans-serif;
    margin: 0;
    padding: 0;
    font-size: 16px;
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
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="icon"
            href="./covid-19.png"
            type="image/gif"
            sizes="16x16"
          />
          <title>Covid-Map</title>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;400;700&display=swap"
          />
          <meta
            name="description"
            content="This is a demo project showing the location of the recent cases
          detected in NSW"
          />
          <meta name="keywords" content="HTML, CSS, JavaScript" />
          <meta name="author" content="Bernardo Munz" />
        </Head>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
