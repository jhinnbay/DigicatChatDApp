"use client";
import React from "react";
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
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
import { useEffect, useState } from "react";

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: '46628dba1c5e4a4771f8dd3816df4d92',
    chains: [sepolia, polygon, optimism, arbitrum, base],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export function Providers({ children }) {

    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
    }, []);

    return ready ? (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    ) : null;
}