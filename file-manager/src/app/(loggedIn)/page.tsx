"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie"; 

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        if (Cookies.get('auth-token') != null) {
            router.push(`/user/${Cookies.get('username')}`);
        }
    }, []) 

    return (
        <div className="w-full h-full flex flex-col items-center content-center justify-center p-10 gap-10">
            <p className="font-bold text-6xl mt-[10%]">Welcome to the File Manager</p>
            <p className="font-semibold text-3xl">This is the home to your files</p>
            <p className="font-medium text-xl">Login to get started</p>
        </div>
    );
}
