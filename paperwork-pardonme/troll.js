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
    if (rng(getRandomInt(100), 75)) {
        person.gender = person.name.first;
        error.push("gender");
    }
    if (rng(getRandomInt(100), 75)) {
        const replacement = getRandomInt(100);
        // matches filename
        const re = /[0,1,2,3,4,5,6,7,8,9].\.jpg/;
        if (replacement !== person.picture.medium.match()) {
            // give up if the rng says so
            console.log(person.picture.medium);
            person.picture.medium = person.picture.medium.replace(re, `${replacement}.jpg`);
            console.log(person.picture.medium);
            error.push("photo");
        }
    }
    console.log(error)
    return error;
}

export { trollPerson, getRandomInt };
