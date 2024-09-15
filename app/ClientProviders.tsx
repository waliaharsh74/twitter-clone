'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function ClientProviders({
    children
}: {
    children: React.ReactNode
}) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId="719850369388-u4vd0dd8lb8ttaltfh2f5modk9695psu.apps.googleusercontent.com">
                {children}
                <ReactQueryDevtools />
            </GoogleOAuthProvider>
        </QueryClientProvider>
    )
}