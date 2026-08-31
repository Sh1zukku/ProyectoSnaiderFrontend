// import { lazy } from "react";
import { createHashRouter, Navigate } from "react-router";

import { HomeLayout } from "@/app/homepage/homelayout";
import HomePage from "@/app/homepage/homepage";
import { AdminLayout } from "@/app/admin/adminlayout";
import { AdminPage } from "@/app/admin/adminpage";
import { AuthLayout } from "@/app/auth/authlayout";
import { LoginPage } from "@/app/auth/loginpage";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "@/components/routes/ProtectedRoutes";



export const appRouter = createHashRouter([

    {
        path: '/',
        element: <NotAuthenticatedRoute><AuthLayout /></NotAuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <LoginPage />
            }
        ]
    },
    {
        path: '/user',
        element: <NotAuthenticatedRoute><HomeLayout /></NotAuthenticatedRoute>,
        children: [
            {
                path: ':id',
                element: <HomePage />
            }
        ]
    },
    {
        path: '/admin',
        element: <AuthenticatedRoute><AdminLayout /></AuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <AdminPage />
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" />
    }
])