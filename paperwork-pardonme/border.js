import "./styles/style.css";
import { DOM } from "./dom.js";
import { days } from "./day.js";
import { trollPerson, getRandomInt } from "./troll.js";
const gameData = {
    day: 0,
    personIndex: 0,
    persons: [],
    passport: null,
    errors: [],
    correct: 0,
    wrong: 0,
    queueSize: 3,
    money: 0,
};

async function getPersons(count) {
    try {
        const response = await fetch(`https://randomuser.me/api/?exc=login,phone,cell,email&results=${count}`);
        if (response.error) {
            console.log("uh oh");
            throw new Error("api exploded");
        }
        // response.json() returns a promise so await it
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("💀", error);
        return -1;
    }
}

function createPassport(person) {
    gameData.passport = window.open("passport.html", "passport", `popup,width=${window.innerWidth / 2},height=${window.innerHeight / 2}`);
    gameData.passport.onload = (event) => {
        gameData.passport.document.querySelector("body").insertAdjacentHTML(
            "beforeend",
            `
            <h2>${person.name.first}'s passport</h2>
            <section>
                <img class="passportphoto" src=${person.picture.medium}></img>
                <p>name: ${person.name.first} ${person.name.last}</p>
                <p>sex: ${person.gender}</p>
                <p>place of origin: ${person.location.state}</p>
                <p>dob: ${new Date(person.dob.date).toDateString().substring(4)}</p>
                <p>issue date: ${new Date(person.registered.date).toDateString().substring(4)}, expires after ${person.registered.expire} year${
                person.registered.expire > 1 ? "s" : ""
            }</p>
            </section>
            `
        );
        gameData.passport.onbeforeunload = function () {
            console.log("hi");
            document.querySelector("#passport").disabled = false;
        };
    };
}

// start of new day
function day() {
    gameData.day++;
    gameData.queueSize = days[gameData.day].queue;
    gameData.persons = [];
    gameData.errors = [];
    gameData.personIndex = 0;
    gameData.correct = 0;
    gameData.wrong = 0;
    DOM.day.innerText = `Day ${gameData.day}`;
    const data = getPersons(gameData.queueSize);
    data.then((result) => {
        if (result === -1) {
            // THE API EXPLODED. PANIC
            DOM.queue.innerText = "the border is empty...";
        } else {
            // continue
            gameData.persons = result.results;
            gameData.persons.forEach((person) => {
                person.errors = trollPerson(person);
            });
            applicant(gameData.persons[gameData.personIndex]);
        }
    });
}

function applicant(person) {
    console.log(person);
    gameData.errors = person.errors;
    DOM.queue.innerText = `${gameData.queueSize - gameData.personIndex} people remaining`;
    DOM.border.innerHTML = `
    <img src=${person.picture.large}></img>
    <button id="passport">open passport</button>
    `;
    document.querySelector("#passport").addEventListener("click", function () {
        createPassport(person);
        this.disabled = true;
    });
}

DOM.discrepancy.addEventListener("input", function () {
    console.log(DOM.reason.value);
});

DOM.stamp.addEventListener("click", function () {
    if (DOM.reason.selectedIndex === 0) {
        if (gameData.errors.length === 0) {
            console.log("awesome");
            gameData.correct++;
        } else {
            alert("you failed and will now be exploded");
            console.log("haha", gameData.errors);
            gameData.wrong++;
        }
    } else {
        // console.log(DOM.reason.value);
        // console.log(errors);
        if (gameData.errors.includes(DOM.reason.value)) {
            console.log("awesome");
            gameData.correct++;
        } else {
            gameData.wrong++;
            if (gameData.errors.length === 0) {
                // the documents were fine
                alert("wrongful denial. you will now be exploded");
            } else {
                // wrong error
                alert("wrong denial reason. you will now be exploded");
            }
        }
        DOM.reason.selectedIndex = 0;
    }
    gameData.personIndex++;
    if (gameData.passport) {
        gameData.passport.close();
    }
    if (gameData.personIndex < gameData.persons.length) {
        applicant(gameData.persons[gameData.personIndex]);
    } else {
        endDay();
    }
});

day();

function endDay() {
    DOM.eod.innerHTML = `
    <h2>end of day ${gameData.day}</h2>
    <h3>you got ${gameData.correct} right and ${gameData.wrong} wrong</h3>
    <button autofocus>OK</button>
    `;
    DOM.eod.querySelector("button").addEventListener("click", function () {
        day();
        DOM.eod.close();
    });
    DOM.eod.showModal();
}
