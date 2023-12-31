const { saveData, getAllData, getData, clearData, deleteData } = require('../scripts/storage.js');

// Display
const timerDisplay = document.getElementById("timer-display");

// Buttons
const startTimer = document.getElementById("start");
const resetTimer = document.getElementById("reset");
const pauseTimer = document.getElementById("pause");
const save = document.getElementById("save");
const clear = document.getElementById("delete");

let hours = 0
let minutes = 0
let seconds = 0

let timerInterval;
let id = 0;

startTimer.addEventListener("click", () => {
    // Check if the timer is not already running

    if (!timerInterval) {
        // Start the timer and store the interval reference
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
                if (minutes === 60) {
                    minutes = 0;
                    hours++;
                }
            }

            // Format the time values with leading zeros
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');

            // Display the formatted time
            timerDisplay.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }, 1000); // Update the timer every 1000 ms (1 second)
    }
});

pauseTimer.addEventListener("click", () => {
    // Stop the timer
    clearInterval(timerInterval);
    timerInterval = null;
})

resetTimer.addEventListener("click", () => {
    // Stop the timer
    clearInterval(timerInterval);
    timerInterval = null;

    // Reset the time values
    hours = 0;
    minutes = 0;
    seconds = 0;

    // Display the time
    timerDisplay.textContent = "00:00:00";
})

// Save the timer value to the store
save.addEventListener("click", () => {
    id++;

    const object = {
        id: id,
        time: timerDisplay.textContent,
        date: new Date().toLocaleDateString()
    }

    saveData(`time-${id}`, object)
    window.location.reload();
})

clear.addEventListener("click", () => {
    clearData();
    window.location.reload();
})

function loadData() {
    // Assume getAllData() returns an array of objects, each containing date and time properties
    const data = getAllData();

    // Initialize variables to store the total hours, minutes, and seconds
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;

    let lastDate = null;
    let firstDate = null;


    // Loop through the data array
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const item = data[key];

            const [hours, minutes, seconds] = item.time.split(':').map(Number);

            // Add the parsed time to the total
            totalHours += hours;
            totalMinutes += minutes;
            totalSeconds += seconds;

            const body = document.getElementById("body");

            const span = document.createElement("span");
            const time = document.createElement("p");
            time.textContent = item.time;

            const date = document.createElement("p");
            date.textContent = item.date;

            const btn = document.createElement("button");
            btn.setAttribute("onclick", `deleteObject(${item.id})`);

            const trashIcon = document.createElement('i');
            trashIcon.className = 'fa fa-trash';

            btn.appendChild(trashIcon);
            date.appendChild(btn);

            span.appendChild(time);
            span.appendChild(date);

            body.appendChild(span);

            id = item.id;
            lastDate = item.date;
        }
    }

    // Calculate the total time in hours, minutes, and seconds
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    const total = document.getElementById("total");
    total.textContent = `${totalHours}:${totalMinutes}:${totalSeconds}`;

    const firstDateText = getData("time-1")
    document.getElementById("first-date").textContent = firstDateText.date;
    document.getElementById("last-date").textContent = lastDate;

}
loadData()

function deleteObject(id) {
    deleteData(`time-${id}`)
    window.location.reload();
}