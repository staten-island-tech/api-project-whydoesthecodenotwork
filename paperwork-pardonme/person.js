// this is just a sample person for reference
// i don't want to keep making api calls
const person = {
    results: [
        {
            gender: "male",
            name: {
                title: "Mr",
                first: "Loïs",
                last: "Fournier",
            },
            location: {
                street: {
                    number: 8847,
                    name: "Rue des Écoles",
                },
                city: "Orléans",
                state: "Côte-D'Or",
                country: "France",
                postcode: 26110,
                coordinates: {
                    latitude: "-14.1400",
                    longitude: "-55.0810",
                },
                timezone: {
                    offset: "+10:00",
                    description: "Eastern Australia, Guam, Vladivostok",
                },
            },
            dob: {
                date: "1949-07-09T05:49:06.999Z",
                age: 74,
            },
            registered: {
                date: "2020-10-30T07:16:44.514Z",
                age: 3,
            },
            picture: {
                large: "https://randomuser.me/api/portraits/men/22.jpg",
                medium: "https://randomuser.me/api/portraits/med/men/22.jpg",
                thumbnail: "https://randomuser.me/api/portraits/thumb/men/22.jpg",
            },
            nat: "FR",
        },
    ],
    info: {
        seed: "5608034e7320ac93",
        results: 1,
        page: 1,
        version: "1.4",
    },
};
