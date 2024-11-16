"use client"

import { SnackbarProvider } from "notistack";

export default function NotiFier({children}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <SnackbarProvider anchorOrigin={{
            vertical: "top",
            horizontal: "center"
        }} maxSnack={1}>
            {children}
        </SnackbarProvider>
    )
}