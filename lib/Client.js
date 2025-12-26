import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

const Client = ({ children }) => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
};

export default Client;
