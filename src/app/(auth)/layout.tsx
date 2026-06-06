"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
}

export default AuthLayout;
