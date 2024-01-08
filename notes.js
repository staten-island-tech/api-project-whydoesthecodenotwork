// function greet(name) {
//     const greetPromise = new Promise(function (resolve, reject) {
//         resolve(`Hello ${name}`);
//     });
//     return greetPromise;
// }

// const joe = greet("joe");
// joe.then((result) => {
//     console.log(result);
// });

// async functions can use promises/await
async function getData() {
    try {
        // fetch = fetch data from internet. returns a promise
        const response = await fetch(`https://api.quotable.io/random`);
        // but 2xx is success. but period is ending so it's 200.
        if (response.status !== 200) {
            console.log("uh oh");
            throw new Error(response.statusText);
        }
        // response.json() returns a promise so await it
        const data = await response.json();
        document.querySelector("h1").innerText = data.content;
        return data;
    } catch (error) {
        console.log("💀", error);
    }
}
console.log(getData());
