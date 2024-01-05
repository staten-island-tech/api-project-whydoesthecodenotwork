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
    trolls: [],
    message: "",
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
        const alt = gameData.errors.includes("photo") ? `a fake picture of ${person.name.first}` : `a picture of ${person.name.first}`;
        // when the Photo Matching is Accessible 😳😳😳
        gameData.passport.document.querySelector("body").insertAdjacentHTML(
            "beforeend",
            `
            <h2>${person.name.first}'s passport</h2>
            <section>
                <img class="passportphoto" src=${person.picture.medium} alt="${alt}"></img>
                <h3>name: ${person.name.first} ${person.name.last}</h3>
                <h3>sex: ${person.gender}</h3>
                <h3>place of origin: ${person.location.state}</h3>
                <h3>dob: ${new Date(person.dob.date).toDateString().substring(4)}</h3>
                <h3>issue date: ${new Date(person.registered.date).toDateString().substring(4)}, expires after ${person.registered.expire} year${
                person.registered.expire > 1 ? "s" : ""
            }</h3>
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
    gameData.message = days[gameData.day].message;
    gameData.queueSize = days[gameData.day].queue;
    gameData.trolls = days[gameData.day].trolls;
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
            // troll everyone
            gameData.persons = result.results;
            gameData.persons.forEach((person) => {
                person.errors = trollPerson(person, gameData.trolls);
            });
            // add denial reasons based on rules
            const rules = {
                none: '<option value="none" selected>this is fine</option>',
                gender: '<option value="gender">the SEX is wrong</option>',
                location: '<option value="location">the ORIGIN LOCATION is wrong</option>',
                dob: '<option value="dob">the DATE OF BIRTH is wrong</option>',
                date: '<option value="expired">the document is EXPIRED</option>}',
                photo: `<option value="photo">the PHOTO doesn't match</option>`,
            };
            DOM.reason.replaceChildren();
            DOM.reason.insertAdjacentHTML("beforeend", rules.none);
            console.log(Object.keys(gameData.trolls));
            Object.keys(gameData.trolls).forEach((troll) => {
                DOM.reason.insertAdjacentHTML("beforeend", rules[troll]);
            });
            // api done doing its thing. let the player start
            DOM.note.querySelector("button").disabled = false;
        }
    });
}

function note() {
    day();
    DOM.note.innerHTML = `
    <section>
    <h2>welcome to day ${gameData.day}</h2>
    <h2>${gameData.message}</h2>
    <button autofocus disabled>start</button>
    </section>
    `;
    DOM.note.querySelector("button").addEventListener("click", function () {
        // summon the first applicant
        applicant(gameData.persons[gameData.personIndex]);
        DOM.note.close();
    });
    DOM.note.showModal();
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

DOM.stamp.addEventListener("click", function () {
    if (DOM.reason.selectedIndex === 0) {
        if (gameData.errors.length === 0) {
            console.log("awesome");
            gameData.correct++;
            gameData.money += 10;
        } else {
            console.log("haha", gameData.errors);
            gameData.wrong++;
            switch (gameData.wrong) {
                case 1:
                    alert("oh brother");
                    break;
                case 2:
                    alert("oh BROTHER");
                    break;
                default:
                    alert("ok buddy. you are losing $20 for that");
                    gameData.money -= 20;
                    break;
            }
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

function endDay() {
    DOM.eod.innerHTML = `
    <h2>end of day ${gameData.day}</h2>
    <h3>you got ${gameData.correct} right and ${gameData.wrong} wrong</h3>
    <button autofocus>OK</button>
    `;
    DOM.eod.querySelector("button").addEventListener("click", function () {
        note();
        DOM.eod.close();
    });
    DOM.eod.showModal();
}

note();
