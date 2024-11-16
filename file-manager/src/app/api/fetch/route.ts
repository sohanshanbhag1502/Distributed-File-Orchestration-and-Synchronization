import fetch from 'node-fetch';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface response {
    token: string | undefined;
    message: string | undefined;
    username: string | undefined;
}

export async function POST(req: NextRequest){
    const cookieStore = cookies();

    const token = req.cookies.get("auth-token")?.value;

    const server_link : string = process.env.SERVER_LINK!;
    if (!server_link) {
        return NextResponse.json({data:"Server Link Not Found"}, {status:500});
    }

    const {link, body} = await req.json();

    const headers: HeadersInit = token?
    {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }:
    {
        'Content-Type': 'application/json'
    }

    const res = await fetch(server_link+link, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    const data = await res.json() as response;
    if (data.token){
        cookieStore.set("auth-token", data.token, {httpOnly:true, sameSite:"strict"});
    }
    return NextResponse.json(data, {status:res.status});
}