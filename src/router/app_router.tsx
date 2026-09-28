// import { lazy } from "react";
import { createHashRouter, Navigate } from "react-router";

import { HomeLayout } from "@/app/homepage/homelayout";
import HomePage from "@/app/homepage/homepage";
import { AdminLayout } from "@/app/admin/pages/layout/adminlayout";
import { AdminPage } from "@/app/admin/pages/home/adminpage";
import { ShipmentPage } from "@/app/admin/pages/shipments/shipmentpage";
import { ClientPage } from "@/app/admin/pages/clientes/clientPage";
import { AuthLayout } from "@/app/auth/authlayout";
import { LoginPage } from "@/app/auth/loginpage";
import { AdminAuthenticatedRoute, AuthenticatedRoute, NotAuthenticatedRoute } from "@/components/routes/ProtectedRoutes";



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
        element: <AuthenticatedRoute><HomeLayout /></AuthenticatedRoute>,
        children: [
            {
                path: ':id',
                element: <HomePage />
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminAuthenticatedRoute><AdminLayout /></AdminAuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <AdminPage />
            },
            {
                path: 'shipments',
                element: <ShipmentPage />
            },
            {
                path: 'clients',
                element: <ClientPage />
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" />
    }
])