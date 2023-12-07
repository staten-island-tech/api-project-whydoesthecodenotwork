import "./styles/style.css";
import { DOM } from "./dom.js";
import { trollPerson, getRandomInt } from "./troll.js";

async function getPersons() {
    try {
        const response = await fetch("https://randomuser.me/api/?exc=login,phone,cell,email&results=5");
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

var passport;
function createPassport(person) {
    passport = window.open("passport.html", "passport", `popup,width=${window.innerWidth / 2},height=${window.innerHeight / 2}`);
    passport.onload = (event) => {
        passport.document.querySelector("body").insertAdjacentHTML(
            "beforeend",
            `
            <h2>${person.name.first}'s passport</h2>
            <section>
                <img class="passportphoto" src=${person.picture.medium}></img>
                <p>name: ${person.name.first} ${person.name.last}</p>
                <p>sex: ${person.gender}</p>
                <p>place of origin: ${person.location.state}</p>
                <p>dob: ${person.dob.date}</p>
                <p>issue date: ${person.registered.date}, expires after ${person.registered.expire} year${person.registered.expire > 1 ? "s" : ""}</p>
            </section>
            `
        );
        passport.onbeforeunload = function () {
            console.log("hi");
            document.querySelector("#passport").disabled = false;
        };
    };
}

var persons = [];
var errors = [];
var personIndex = 0;
function day() {
    const data = getPersons();
    data.then((result) => {
        persons = result.results;
        persons.forEach((person) => {
            person.registered.expire = getRandomInt(5);
            person.errors = trollPerson(person);
        });
        applicant(persons[personIndex]);
    });
}

function applicant(person) {
    console.log(person);
    errors = person.errors;
    document.querySelector("#border").innerHTML = `
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
        if (errors.length === 0) {
            console.log("awesome");
        } else {
            alert("you failed and will now be exploded because:", errors);
        }
    } else {
        // console.log(DOM.reason.value);
        // console.log(errors);
        if (errors.includes(DOM.reason.value)) {
            console.log("awesome");
        } else {
            console.log(errors.length);
            if (errors.length === 0) {
                // the documents were fine
                alert("wrongful denial. you will now be exploded");
            } else {
                // wrong error
                alert("wrong denial reason. you will now be exploded");
            }
        }
        DOM.reason.selectedIndex = 0;
    }
    personIndex++;
    if (passport) {
        passport.close();
    }
    if (personIndex <= persons.length) {
        applicant(persons[personIndex]);
    }
});

day();
