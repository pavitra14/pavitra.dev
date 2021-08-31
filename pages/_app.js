import Router from 'next/router'
import "../styles/prismic.css";
import "../styles/global.css";
import "../styles/nprogress.css";
import NProgress from 'nprogress'

Router.events.on('routeChangeStart', ()=> NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
