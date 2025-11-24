import { NextResponse } from 'next/server';
import { syncMenu } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const { item, action } = await request.json();
        await syncMenu(item, action);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Sheet Sync Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to sync' }, { status: 500 });
    }
}
