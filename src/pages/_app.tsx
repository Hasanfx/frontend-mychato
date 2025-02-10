import "@/styles/globals.css";
import '../styles/globals.css'; // Ensure this line is present

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
