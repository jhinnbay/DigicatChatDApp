"use client";
import { React, useEffect, useState } from "react";
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { SessionProvider, useSession } from 'next-auth/react';
import { RainbowKitSiweNextAuthProvider, } from '@rainbow-me/rainbowkit-siwe-next-auth';

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: '46628dba1c5e4a4771f8dd3816df4d92',
    chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }) {

    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
    }, []);

    return ready ? (
        <WagmiProvider config={config} >
            <SessionProvider>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitSiweNextAuthProvider>
                        <RainbowKitProvider>{children}</RainbowKitProvider>
                    </RainbowKitSiweNextAuthProvider>
                </QueryClientProvider>
            </SessionProvider>
        </WagmiProvider>
    ) : null;
}