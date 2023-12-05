// number 1 to max
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

// return true if the roll beats requirement
function rng(roll, requirement) {
    if (roll >= requirement) {
        return 1;
    }
    return 0;
}

function trollPerson(person) {
    const error = [];
    if (rng(getRandomInt(100), 0)) {
        person.gender = person.name.first;
        error.push("gender");
    }
    return error;
}

export { trollPerson, getRandomInt };
