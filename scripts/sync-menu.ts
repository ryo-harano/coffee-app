// このスクリプトは、現在のメニューデータをGoogle Sheetsに同期します
// 使い方: ブラウザのコンソールで以下を実行
// fetch('/api/sheets/sync-menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ menuItems: JSON.parse(localStorage.getItem('coffee-menu-v6')) }) })

console.log('Menu sync script loaded');
