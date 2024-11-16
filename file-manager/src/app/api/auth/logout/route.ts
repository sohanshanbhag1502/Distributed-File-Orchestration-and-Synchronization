import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export function POST(req: NextRequest) {
    const cookieStore = cookies();
    cookieStore.set('auth-token', '', { expires: new Date(0) });
    return NextResponse.json({ message: 'Success' });
}