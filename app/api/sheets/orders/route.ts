import { NextResponse } from 'next/server';
import { appendOrder } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const order = await request.json();
        await appendOrder(order);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Sheet Sync Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to sync' }, { status: 500 });
    }
}
