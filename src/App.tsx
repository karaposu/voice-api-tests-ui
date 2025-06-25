import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import ChatPage from "./components/ChatPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Topside from "./components/Topside";

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="h-screen">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Topside />
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors={true} />

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
