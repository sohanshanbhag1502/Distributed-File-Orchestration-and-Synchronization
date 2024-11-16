"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";

export default function NavBar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const postLoggedIn = async () => {
        const res = await fetch('/api/auth/loggedIn', {
            method: 'POST',
        });
        const data = await res.json();
        if (res.status === 200) {
            enqueueSnackbar("Logged In as "+data.username, { variant: "success" });
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }

    const postLogout = async () => {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
        });
        if (response.status === 200) {
            enqueueSnackbar("Logged Out Successfully", { variant: "success" });
            setLoggedIn(false);
            router.push('/');
        } else {
            enqueueSnackbar("Unable to reach the server", { variant: "error" });
        }
    }

    useEffect(() => { postLoggedIn() }, []);

    return (
        <div className="w-full px-8 p-6 flex items-center content-center justify-between">
            <div className="flex items-center content-center justify-center gap-2">
                <img src="/icon.png" alt="Icon" className="w-11" /> 
                <h1 className="text-3xl font-semibold">File Manager</h1>   
            </div>
            <ul className="flex content-center items-center justify-center gap-10">
                <li>
                    <Link href="/" className="font-bold hover:text-gray-400 text-xl">
                        Home
                    </Link>
                </li>
                <li>
                    {
                        loggedIn?
                        <button className="font-bold text-xl border-2 border-white 
                        rounded-full px-4 p-1 hover:bg-white hover:text-black transition-all
                        duration-150 flex items-center gap-1"
                        onClick={postLogout}>
                            <MdLogout />
                            Logout
                        </button>
                        :
                        <Link href="/login" className="font-bold text-xl border-2 border-white 
                        rounded-full px-4 p-1 hover:bg-white hover:text-black transition-all
                        duration-150">
                            Login
                        </Link>
                    }
                </li>
            </ul>
        </div>
    )
}