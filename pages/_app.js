import Router from 'next/router'
import "../styles/global.css";
import NProgress from 'nprogress'

Router.events.on('routeChangeStart', ()=> NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
export default function App({ Component, pageProps }) {
  console.log(pageProps)
  return <Component {...pageProps} />;
}
