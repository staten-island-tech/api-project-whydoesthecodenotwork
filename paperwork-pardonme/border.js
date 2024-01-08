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
    citation: null,
    people: [],
    cost: 15,
    friend: "",
};

async function getPersons(count) {
    try {
        const response = await fetch(`https://randomuser.me/api/?exc=login,phone,cell,email&results=${count}`);
        // the section in their documentation for error handling is literally just that they return:
        // {error: "Uh oh, something has gone wrong. Please tweet us @randomapi about the issue. Thank you."}
        // no error codes or anything...
        if (response.error) {
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
        gameData.passport.document.body.insertAdjacentHTML(
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
                person.registered.expire === 1 ? "" : "s"
            }</h3>
                </section>
            `
        );
        gameData.passport.onbeforeunload = function () {
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
    gameData.friend = days[gameData.day].friend;
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
            DOM.note.innerHTML = `
            <h2><em>bad news: the border is closed today</em></h2>
            <p>(the API used to create entrants is currently down, so you can't play this game.)</p>
            `;
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
            Object.keys(gameData.trolls).forEach((troll) => {
                DOM.reason.insertAdjacentHTML("beforeend", rules[troll]);
            });
            // api done doing its thing. let the player start
            DOM.note.querySelector("button").disabled = false;
            DOM.note.querySelector("button").innerText = "start";
            DOM.note.querySelector("button").focus();
        }
    });
}

function note() {
    kablooey();
    day();
    DOM.note.innerHTML = `
    <section>
    <h2>welcome to day ${gameData.day}</h2>
    ${gameData.message}
    <h3>you have ${gameData.money} credits</h3>
    <button disabled>loading...</button>
    </section>
    `;
    DOM.note.querySelector("button").addEventListener("click", function () {
        // summon the first applicant
        applicant(gameData.persons[gameData.personIndex]);
        DOM.note.close();
        document.querySelector("#passport").focus();
    });
    DOM.note.showModal();
}

function applicant(person) {
    gameData.errors = person.errors;
    DOM.queue.innerHTML = `${gameData.queueSize - gameData.personIndex} people remaining<meter min="0" max="${gameData.queueSize}" value="${
        gameData.queueSize - gameData.personIndex
    }">${gameData.queueSize}/${gameData.personIndex}/gameData.personIndex</meter>`;
    DOM.border.innerHTML = `
    <img src=${person.picture.large} alt="a picture of ${person.name.first}"></img>
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
            right();
        } else {
            wrong("allow");
        }
    } else {
        if (gameData.errors.includes(DOM.reason.value)) {
            right();
        } else {
            wrong("deny");
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
    document.querySelector("#passport").focus();
});

function right() {
    gameData.money += 5;
    gameData.correct++;
}

function wrong(reason) {
    gameData.wrong++;
    if (gameData.citation) {
        gameData.citation.close();
    }
    gameData.citation = window.open("citation.html", "citation", `popup,width=${window.innerWidth / 3},height=${window.innerHeight / 3}`);
    gameData.citation.onload = (event) => {
        const shout = reason === "deny" ? "that passport was fine!!" : "that passport was wrong!!";
        let penalty = "";
        switch (gameData.wrong) {
            case 1:
                penalty = "citation 1, no penalty";
                break;
            case 2:
                penalty = "citation 2, final warning!";
                break;
            default:
                if (gameData.wrong > 5) {
                    penalty = "here's another citation. your penalty is instant debt";
                    gameData.money = -1000000000;
                } else {
                    penalty = `citation ${gameData.wrong}, penalty is -${gameData.wrong * 5} credits`;
                    gameData.money -= gameData.wrong * 5;
                }
                break;
        }
        gameData.citation.document.body.insertAdjacentHTML(
            "beforeend",
            `
            <h1>${shout}</h1>
            <h2>${penalty}</h2>
            <h3>(feel free to close this window)</h3>
            `
        );
    };
}

function endDay() {
    const gifts = [];
    function gift(person) {
        const gift = ["has something for you", "has a gift for you", "brought you some money", "gave you some money", "got some money for you"];
        const giftAmount = getRandomInt(10);
        gameData.money += giftAmount;
        gifts.push(`${person} ${gift[getRandomInt(gift.length) - 1]}. you receive ${giftAmount} credits`);
    }
    kablooey();
    // i love rng!!
    gameData.people.forEach((person) => {
        if (getRandomInt(5) === 1) {
            gift(person);
        }
    });

    // if someone is being added today, they will bring a welcome gift.
    if (gameData.friend !== "") {
        gameData.people.push(gameData.friend);
        gift(gameData.friend);
    }

    DOM.eod.innerHTML = `
    <h2>end of day ${gameData.day}</h2>
    <h3>you got ${gameData.correct} right and ${gameData.wrong} wrong</h3>
    <h3>you have ${gameData.money} credits</h3>
    <button autofocus>continue</button>
    `;
    gifts.forEach((gift) => {
        DOM.eod.querySelector("button").insertAdjacentHTML("beforebegin", `<h3>${gift}</h3>`);
    });
    if (gameData.day === 3) {
        DOM.eod
            .querySelector("button")
            .insertAdjacentHTML("beforebegin", `<h3>your boss has promoted you to being retired. congratulations. you did it. you won. cool.</h3>`);
        DOM.eod.querySelector("button").remove();
        DOM.eod.showModal();
        return;
    }
    DOM.eod.querySelector("button").addEventListener("click", function () {
        const cost = (gameData.people.length + 1) * gameData.cost;
        if (gameData.money >= cost) {
            // note is the message shown before each day (with start button)
            gameData.money -= cost;
            note();
            DOM.eod.close();
        } else {
            let gameOverMessage = "";
            if (gameData.people.length > 0) {
                if (gameData.money >= gameData.cost) {
                    // if you have a family and not enough money to feed everyone
                    const victims = gameData.people.length + 1 - Math.floor(gameData.money / gameData.cost);
                    gameOverMessage = `you could not afford to feed ${victims} member${
                        victims === 1 ? "" : "s"
                    } of your family. the government has fired you for failing to provide for them. (sorry)`;
                } else {
                    // if you have a family and can't feed anyone
                    gameOverMessage = `you could not afford to feed anyone in your family, including yourself. you are now dead (sorry)`;
                }
            } else {
                // you're alone, and dead. sorry
                gameOverMessage = `you could not afford food for yourself and died of starvation (sorry).`;
            }
            DOM.eod.innerHTML = `
                <h2><em>game over</em></h2>
                <h2>unfortunately, ${gameData.money} credits isn't enough to make ends meet.</h2>
                <p>${gameOverMessage}</p>
                `;
        }
    });

    DOM.eod.showModal();
}

// ahh, perry the platypus. allow me to introduce you to my nuh-uh-inator.
// (stop esc from closing modal dialogs)
function nuhUh(element) {
    element.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
        }
    });
}
nuhUh(DOM.note);
nuhUh(DOM.eod);

function kablooey() {
    if (gameData.passport) {
        gameData.passport.close();
    }
    if (gameData.citation) {
        gameData.citation.close();
    }
    if (gameData.note) {
        gameData.note.close();
    }
}

note();
