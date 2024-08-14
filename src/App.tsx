/*
    (C) Brackenbit 2024
*/

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./features/authentication/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeProvider } from "./context/DarkModeContext";
import ToasterWithMax from "./ui/ToasterWithMax";
import Landing from "./pages/Landing";
import IndexRedirect from "./ui/IndexRedirect";
import Dashboard from "./pages/Dashboard";
import Widgets from "./pages/Widgets";
import Help from "./pages/Help";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
});

function App() {
    return (
        <DarkModeProvider>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <BrowserRouter>
                    <Routes>
                        {/* Redirect for "/" */}
                        <Route path="/" element={<IndexRedirect />} />
                        {/* Protected routes */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/help" element={<Help />} />
                            <Route path="/widgets" element={<Widgets />} />
                        </Route>
                        {/* Public routes */}
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>

                <ToasterWithMax max={3} />
            </QueryClientProvider>
        </DarkModeProvider>
    );
}

export default App;
