const { app, BrowserWindow, Menu, dialog} = require("electron");
const fs = require("fs");

const ElectronStore = require('electron-store');
ElectronStore.initRenderer();

const {getAllData, saveData} = require("./scripts/storage");
const { join} = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
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
        {
            label: "Save/Load",
            submenu: [
                {
                    label: "Save",
                    click: () => {
                        exportDataToJSON(getAllData());
                    },
                },
                {
                    label: "Load",
                    click: () => {
                        loadJSONFile();
                        const mainWindow = BrowserWindow.getFocusedWindow();
                        if (mainWindow) {
                            mainWindow.webContents.reload();
                        }
                    },
                },
            ],
        },
        {
            label: "About",
            submenu: [
                {
                    label: "Home",
                    click: () => {
                        mainWindow.loadFile("./views/index.html");
                    },
                },
                {
                    label: "Changelogs",
                    click: () => {
                        mainWindow.loadFile("./views/changelog.html");
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

// Custom functions
function exportDataToJSON(data) {
    dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: join(__dirname, '../assets/userdata.json'),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only json Files.
        filters: [
            {
                name: 'UserData',
                extensions: ['json']
            }, ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        if (!file.canceled) {

            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('Saved!');
            })

        }
    }).catch(err => {
        console.log(err)
    });
}

function loadJSONFile() {
    dialog
        .showOpenDialog({
            title: 'Select the File to load',
            defaultPath: join(__dirname, '../assets/userdata.json'),
            buttonLabel: 'Load',
            filters: [
                {
                    name: 'UserData',
                    extensions: ['json'],
                },
            ],
            properties: [],
        })
        .then((file) => {
            // Check if the file dialog was canceled or not
            if (!file.canceled) {
                const filePath = file.filePaths[0];
                console.log(filePath);

                // Read the JSON file
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.error(err);
                    } else {
                        const jsonData = data.toString();
                        const parsedData = JSON.parse(jsonData);
                        saveData(parsedData);
                    }
                });
            } else {
                console.log('File dialog was canceled.');
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

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