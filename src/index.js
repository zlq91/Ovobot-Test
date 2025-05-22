const { app, BrowserWindow } = require("electron");
const path = require("path");

// const SerialPort = require('serialport');
// const port = new SerialPort('COM3', { baudRate: 9600 });
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: `${__dirname}/images/ovobot_images/cleanrobot_icon128.png`, // 窗口图标，指定图标路径
        // frame:false,// 设置为false以去除默认的窗口边框和工具栏
        webPreferences: {
            nodeIntegration: false,
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, // 注意：在 Electron 12+ 中，需要设置为 contextIsolation: false 和 nodeIntegration: true 或使用 preload script 来启用 Node.js 功能。
            contextIsolation: false, // false if you want to run Electron apps without context isolation
        },
    });
    win.setIcon(`${__dirname}/images/ovobot_images/icons/cleanrobot_16-256.ico`); // 设置任务栏图标
    // 开发环境加载 Vite 服务器
    if (process.env.NODE_ENV === "development") {
        win.loadURL("http://localhost:8000");
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, "/dist/index.html"));
    }
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
