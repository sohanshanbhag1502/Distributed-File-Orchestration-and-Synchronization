import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(req: NextRequest) {
    const cookie = req.cookies.get('auth-token')?.value;
    if (!cookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        var { payload } = await jwtVerify(cookie, new TextEncoder().encode(process.env.JWT_SECRET));
    }
    catch (e) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ username: payload.username });
}