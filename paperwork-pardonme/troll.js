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
            date.setFullYear(currentDate.getFullYear() - (person.registered.expire + getRandomInt(3)));
            person.registered.date = date.toISOString();
            error.push("expired");
        },
        photo: function (person) {
            const replacement = getRandomInt(100);
            // matches filename
            const re = /[0,1,2,3,4,5,6,7,8,9].\.jpg/;
            if (replacement !== person.picture.medium.match()) {
                // give up if the rng says so
                person.picture.medium = person.picture.medium.replace(re, `${replacement}.jpg`);
                error.push("photo");
            }
        },
        place: function (person) {
            person.location.country = "Real Place Land";
            error.push("location");
        },
        dob: function (person) {
            person.dob.date = currentDate.toISOString();
            error.push("dob");
        },
    };

    Object.entries(trolls).forEach((troll) => {
        if (rng(getRandomInt(100), troll[1])) {
            funkyTown[troll[0]](person);
        }
    });

    return error;
}

export { trollPerson, getRandomInt };
