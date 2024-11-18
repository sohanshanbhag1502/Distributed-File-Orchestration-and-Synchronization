"use client"

import Link from "next/link";
import { useState, MouseEvent } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function Login() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const postLogin =async (e : MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL+"/auth/signin", {
            method: "POST",
            body: JSON.stringify({ username, password })
        });
        const res = await response.json();
        if (response.status === 200) {
            Cookies.set('auth-token', res.token);
            Cookies.set("username", res.username);
            router.push(`/user/${res.username}`);
        }
        else if (res){
            enqueueSnackbar(res.message, { variant: "error" });
        }
        else{
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    }

    return (
        <>
            <p className="text-4xl font-bold">Login</p>
            <input 
            type="text" 
            placeholder="Username" 
            className="p-2 border-[1px] active:border-[1px] rounded-full text-white 
            bg-black w-full text-center text-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            />
            <input 
            type="password" 
            placeholder="Password" 
            className="p-2 border-[1px] active:border-[1px] rounded-full text-white 
            bg-black w-full text-center text-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button
            type="submit"
            className="p-2 bg-blue-700 text-white rounded-full text-xl w-[50%]
            hover:bg-blue-600 font-semibold"
            onClick={postLogin}>
                Login
            </button>
            <p className="font-medium text-lg">
                Don&apos;t have a account?&nbsp;&nbsp;
                <Link href="/register" className="text-blue-700 underline"> 
                    Register
                </Link>
            </p>
        </>
    );
}