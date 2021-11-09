import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Wave Portal</title>
        <meta name="title" content="Wave Portal" />
        <meta
          name="description"
          content="I want to meet you! Send me a wave now!"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://buildspace.so/" />
        <meta property="og:title" content="Wave Portal" />
        <meta
          property="og:description"
          content="I want to meet you! Send me a wave now!"
        />
        <meta
          property="og:image"
          content="https://s3.amazonaws.com/cdn.buildspace.so/courses/ethereum-smart-contracts/metadata.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://buildspace.so/" />
        <meta property="twitter:title" content="Wave Portal" />
        <meta
          property="twitter:description"
          content="I want to meet you! Send me a wave now!"
        />
        <meta
          property="twitter:image"
          content="https://s3.amazonaws.com/cdn.buildspace.so/courses/ethereum-smart-contracts/metadata.png"
        />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
