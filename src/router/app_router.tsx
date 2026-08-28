// import { lazy } from "react";
import { createHashRouter, Navigate } from "react-router";

import { HomeLayout } from "@/app/homepage/homelayout";
import HomePage from "@/app/homepage/homepage";
import { AdminLayout } from "@/app/admin/adminlayout";
import { AdminPage } from "@/app/admin/adminpage";
import { LoginPage } from "@/app/auth/loginpage";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "@/components/routes/ProtectedRoutes";



export const appRouter = createHashRouter([

    {
        path: '/',
        element: <NotAuthenticatedRoute><HomeLayout /></NotAuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <LoginPage />
            },
            {
                path: "user/:id",
                element: <HomePage />
            },
            {
                path: '*',
                element: <Navigate to="/" />
            }
        ]
    },
    {
        path: '/admin',
        element:<AuthenticatedRoute><AdminLayout /></AuthenticatedRoute> ,
        children: [
            {
                index: true,
                element: <AdminPage />
            }
        ]

    },
    
])