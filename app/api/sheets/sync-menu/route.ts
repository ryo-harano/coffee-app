import { NextResponse } from 'next/server';
import { getDoc } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const { menuItems } = await request.json();

        console.log('Syncing menu items:', menuItems?.length);

        const doc = await getDoc();
        if (!doc) {
            console.error('Google Sheets not configured');
            return NextResponse.json({ error: 'Google Sheets not configured' }, { status: 500 });
        }

        let sheet = doc.sheetsByTitle['Menu'];
        if (!sheet) {
            console.log('Creating new Menu sheet');
            sheet = await doc.addSheet({
                headerValues: ['ID', 'Name', 'Description', 'Price S', 'Price M', 'Price L', 'Category', 'Image URL', 'Available Temperatures', 'Available Sizes'],
                title: 'Menu'
            });
        }

        // 既存の行をすべて削除
        const rows = await sheet.getRows();
        console.log('Deleting existing rows:', rows.length);
        for (const row of rows) {
            await row.delete();
        }

        // 新しいデータを追加
        console.log('Adding new rows:', menuItems.length);
        for (const item of menuItems) {
            // CategoryがHotまたはIceの場合はDrinkに変換
            let category = item.category;
            if (category === 'Hot' || category === 'Ice') {
                category = 'Drink';
            }

            const rowData = {
                ID: item.id,
                Name: item.name,
                Description: item.description,
                'Price S': item.prices.s,
                'Price M': item.prices.m,
                'Price L': item.prices.l,
                Category: category,
                'Image URL': item.image,
                'Available Temperatures': item.availableTemperatures?.join(',') || '',
                'Available Sizes': item.availableSizes?.join(',') || 'S,M,L',
            };
            console.log('Adding row:', item.name, '- Category:', category);
            await sheet.addRow(rowData);
        }

        console.log('Menu sync completed successfully');
        return NextResponse.json({ success: true, count: menuItems.length });
    } catch (error) {
        console.error('Menu sync error:', error);
        return NextResponse.json({ error: 'Failed to sync menu', details: String(error) }, { status: 500 });
    }
}
