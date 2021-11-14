import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>The best YouTube videos</title>
        <meta name="title" content="The best YouTube videos" />
        <meta name="description" content="Share your favorite YouTube video!" />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://best-youtube-videos.vercel.app/"
        />
        <meta property="og:title" content="The best YouTube videos" />
        <meta
          property="og:description"
          content="Share your favorite YouTube video!"
        />
        <meta
          property="og:image"
          content="https://best-youtube-videos.vercel.app/og-image.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://best-youtube-videos.vercel.app/"
        />
        <meta property="twitter:title" content="The best YouTube videos" />
        <meta
          property="twitter:description"
          content="Share your favorite YouTube video!"
        />
        <meta
          property="twitter:image"
          content="https://best-youtube-videos.vercel.app/og-image.png"
        />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
