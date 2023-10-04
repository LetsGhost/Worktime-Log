const { app, BrowserWindow, Menu, dialog } = require("electron");
const ElectronStore = require('electron-store');
ElectronStore.initRenderer();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("./views/index.html");

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", () => {
    createWindow();

    // Create the menu template
    const menuTemplate = [
        {
            label: "Dev",
            submenu: [
                {
                    label: "Refresh",
                    accelerator: "F11",
                    click: () => {
                        const mainWindow = BrowserWindow.getFocusedWindow();
                        if (mainWindow) {
                            mainWindow.webContents.reload();
                        }
                    },
                },
                {
                    label: "DevTools",
                    accelerator: "F12",
                    click: () => {
                        // Open the Developer Tools for the main window
                        mainWindow.webContents.openDevTools();
                    },
                },
            ],
        },
    ];

    // Create the menu from the template
    const menu = Menu.buildFromTemplate(menuTemplate);

    // Set the application menu
    Menu.setApplicationMenu(menu);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});