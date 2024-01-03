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

function trollPerson(person, trolls) {
    const error = [];

    // assign all persons a non-expired date before trolling them
    const currentDate = new Date();
    const date = new Date(person.registered.date);
    person.registered.expire = getRandomInt(5);
    date.setFullYear(currentDate.getFullYear() - getRandomInt(person.registered.expire - 1));
    person.registered.date = date.toISOString();

    // won't you take me to
    const funkyTown = {
        gender: function (person) {
            person.gender = person.name.first;
            error.push("gender");
        },
        date: function (person) {
            console.log("date exploding");
            date.setFullYear(currentDate.getFullYear() - (person.registered.expire + getRandomInt(3)));
            error.push("expired");
            person.registered.date = date.toISOString();
        },
    };

    Object.entries(trolls).forEach((troll) => {
        console.log(troll);
        if (rng(getRandomInt(100), troll[1])) {
            console.log("WHASOHDUW  ");
            funkyTown[troll[0]](person);
        }
    });

    /*     // wrong picture
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
    } */

    console.log(error);
    return error;
}

export { trollPerson, getRandomInt };
