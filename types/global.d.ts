// 🔧 Global Types cho Firebase
// Khai báo types cho window object

declare global {
  interface Window {
    firebaseApp: any;
    database: any;
    firebase: any;
  }
}

export {};
