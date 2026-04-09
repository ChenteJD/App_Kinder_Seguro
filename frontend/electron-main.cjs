const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Kinder Seguro v1.0.0",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.removeMenu(); // Quitar menú genérico de la parte superior

  // Cargar la app compilada de React
  const distPath = path.join(__dirname, 'dist', 'index.html');
  win.loadFile(distPath);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
