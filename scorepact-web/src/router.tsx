import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { useAuth } from "./lib/auth";
import { Landing } from "./routes/landing/Landing";
import { Login } from "./routes/auth/Login";
import { Register } from "./routes/auth/Register";
import { CreatePool } from "./routes/app/CreatePool";
import { AppShell } from "./routes/app/AppShell";
import { Predict } from "./routes/app/Predict";
import { Table } from "./routes/app/Table";

function RequireAuth() {
    const { isLoaded, isSignedIn } = useAuth();
    if (!isLoaded) return null;
    return isSignedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
    {
        element: <Outlet />,
        // errorElement: <RouteError />,
        children: [
            { path: "/", element: <Landing /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            {
                element: <RequireAuth />,
                children: [
                    { path: "/app/new", element: <CreatePool /> }, // full-screen onboarding, no shell
                    {
                        path: "/app",
                        element: <AppShell />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="/app/predict" replace />,
                            },
                            { path: "predict", element: <Predict /> },
                            { path: "table", element: <Table /> },
                        ],
                    },
                ],
            },
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
]);
