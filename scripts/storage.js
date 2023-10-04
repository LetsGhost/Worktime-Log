const Store = require('electron-store');

const store = new Store(); // Initialize Electron Store

// Function to save data to the store
function saveData(key, value) {
    store.set(key, value);
}

// Function to retrieve data from the store
function getData(key) {
    return store.get(key);
}

function clearData() {
    store.clear();
}

function getAllData() {
    return store.store;
}

function deleteData(key) {
    store.delete(key);
}

module.exports = {
    saveData,
    getData,
    clearData,
    getAllData,
    deleteData
}