import "./styles/style.css";
import { DOM } from "./dom.js";
import { trollPerson, getRandomInt } from "./troll.js";

async function getPersons() {
    try {
        const response = await fetch("https://randomuser.me/api/?exc=login,phone,cell,email&results=1");
        if (response.error) {
            console.log("uh oh");
            throw new Error("api exploded");
        }
        // response.json() returns a promise so await it
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("💀", error);
        return -1;
    }
}

function createPassport(person) {
    const passport = window.open("passport.html", "passport", `popup,width=${window.innerWidth / 2},height=${window.innerHeight / 2}`);
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

const persons = getPersons();
persons.then((result) => {
    result.results.forEach((person) => {
        person.registered.expire = getRandomInt(5);
        trollPerson(person);
    });
    const person = result.results[0];
    document.querySelector("#border").innerHTML = `
    <img src=${person.picture.large}></img>
    <button id="passport">open passport</button>
    `;
    document.querySelector("#passport").addEventListener("click", function () {
        createPassport(person);
        this.disabled = true;
    });
});

DOM.discrepancy.addEventListener("input", function () {
    DOM.deny.style.display = DOM.reason.selectedIndex !== 0 ? "flex" : "none";
    console.log(DOM.reason.value);
});

DOM.deny.addEventListener("input", function () {});
