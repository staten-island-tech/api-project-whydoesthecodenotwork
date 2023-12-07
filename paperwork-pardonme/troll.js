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

    // wrong gender
    if (rng(getRandomInt(100), 90)) {
        person.gender = person.name.first;
        error.push("gender");
    }

    // wrong picture
    if (rng(getRandomInt(100), 90)) {
        const replacement = getRandomInt(100);
        // matches filename
        const re = /[0,1,2,3,4,5,6,7,8,9].\.jpg/;
        if (replacement !== person.picture.medium.match()) {
            // give up if the rng says so
            person.picture.medium = person.picture.medium.replace(re, `${replacement}.jpg`);
            error.push("photo");
        }
    }

    // wrong place
    if (rng(getRandomInt(100), 90)) {
        person.location.country = "Real Place Land";
        error.push("location");
    }

    // wrong place
    const currentDate = new Date();
    person.registered.expire = getRandomInt(5);
    if (rng(getRandomInt(100), 50)) {
        const date = new Date(person.registered.date);
        date.setFullYear(currentDate.getFullYear() - (person.registered.expire + getRandomInt(3)));
        person.registered.date = date.toISOString();
        error.push("expired");
    } else {
        const date = new Date(person.registered.date);
        date.setFullYear(currentDate.getFullYear() - getRandomInt(person.registered.expire - 1));
        person.registered.date = date.toISOString();
    }
    console.log(error);
    return error;
}

export { trollPerson, getRandomInt };
