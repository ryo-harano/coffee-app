import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Config variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

export const getDoc = async () => {
    if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        console.warn('Google Sheets credentials missing');
        return null;
    }

    try {
        const serviceAccountAuth = new JWT({
            email: GOOGLE_CLIENT_EMAIL,
            key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        return doc;
    } catch (error) {
        console.error('Google Sheets Auth Error:', error);
        return null;
    }
};

export const appendOrder = async (order: any) => {
    const doc = await getDoc();
    if (!doc) return;

    let sheet = doc.sheetsByTitle['Orders'];
    if (!sheet) {
        sheet = await doc.addSheet({
            headerValues: ['order_id', 'date', 'total', 'items_summary', 'timestamp', 'estimated_time', 'viewed'],
            title: 'Orders'
        });
    }

    const itemsSummary = order.items.map((i: any) => `${i.name} (${i.size}/${i.temperature}) x${i.quantity}`).join(', ');

    // タイムスタンプを作成（日本時間）
    const orderDate = new Date(order.date);
    const timestamp = orderDate.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // 予想ピックアップ時間を計算（注文時刻 + 10分、5分単位に切り上げ）
    const pickupDate = new Date(orderDate.getTime() + 10 * 60000);
    const minutes = pickupDate.getMinutes();
    const remainder = minutes % 5;
    if (remainder !== 0) {
        pickupDate.setMinutes(minutes + (5 - remainder));
    }
    pickupDate.setSeconds(0);
    pickupDate.setMilliseconds(0);

    const estimatedTime = pickupDate.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    await sheet.addRow({
        order_id: order.id,
        date: order.date,
        total: order.total,
        items_summary: itemsSummary,
        timestamp: timestamp,
        estimated_time: estimatedTime,
        viewed: order.viewed ? 'Yes' : 'No',
    });
};

export const syncMenu = async (item: any, action: 'add' | 'update' | 'delete') => {
    const doc = await getDoc();
    if (!doc) return;

    let sheet = doc.sheetsByTitle['Menu'];
    if (!sheet) {
        sheet = await doc.addSheet({
            headerValues: ['id', 'name', 'description', 'category', 'price_s', 'price_m', 'price_l', 'image', 'temps'],
            title: 'Menu'
        });
    }

    const rows = await sheet.getRows();
    const existingRow = rows.find(row => row.get('id') === item.id);

    if (action === 'delete') {
        if (existingRow) await existingRow.delete();
        return;
    }

    const rowData = {
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        price_s: item.prices.s,
        price_m: item.prices.m,
        price_l: item.prices.l,
        image: item.image,
        temps: item.availableTemperatures?.join(',') || '',
    };

    if (action === 'update' && existingRow) {
        existingRow.assign(rowData);
        await existingRow.save();
    } else if (action === 'add') {
        await sheet.addRow(rowData);
    }
};
