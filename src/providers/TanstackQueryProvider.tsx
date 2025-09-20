"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // todo: delete
import { ReactNode, useState } from "react";

const queryClient = new QueryClient();

export default function TanstackQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client] = useState(() => queryClient);
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
