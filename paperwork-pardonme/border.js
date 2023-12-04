import "./style.css";
// import { setupCounter } from './counter.js'

async function getPersons() {
    try {
        const response = await fetch("https://randomuser.me/api/?exc=login,phone,cell,email&results=10");
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
    const passport = window.open("passport.html", "passport", "popup");
    passport.onload = (event) => {
        passport.document.querySelector("body").insertAdjacentHTML("beforeend", `this is ${person.name.first}`);
    };
    // document.querySelector("h1").insertAdjacentHTML("afterend", `<h2>this is ${person.name.first} and is ${person.gender}</h2>`);
    // document.body.innerHTML = `
    // <div>
    //     <h2>this is ${person.name.first} and is ${person.gender}</h2>
    // </div>
    // `;
}

const persons = getPersons();
persons.then((result) => {
    // result.results.forEach((person) => {
    // });
    createPassport(result.results[0]);
    document.querySelector("#border").innerHTML = `<img src=${result.results[0].picture.large}></img>`;
});
