import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/global.css";
import "../lib/dayjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import { DefaultSeo } from "next-seo";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <DefaultSeo
                    openGraph={{
                        type: "website",
                        locale: "pt_BR",
                        url: "https://www.ignitecall.com/",
                        siteName: "Ignite Call",
                    }}
                />
                <Component {...pageProps} />
            </SessionProvider>
        </QueryClientProvider>
    );
}
