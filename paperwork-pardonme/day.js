// message will be used in html
const days = {
    1: {
        queue: 10,
        trolls: { expire: 60 },
        message: `
            <h3>and welcome to your new job as borderman.</h3>
            <h3><em>as borderman, your job is simple:</em></h3>
            <ul>
                <li>examine people's passports by clicking "open passport"</li>
                <li>allow people with valid passports by selecting "this is fine" from the dropdown and clicking "submit"</li>
                <li>deny people with invalid passports by selecting an appropriate denial reason from the dropdown and clicking "submit"</li>
            </ul>
            <p>today is the grand opening of this border, so expect a lot of people. more specifically, a lot of people with expired passports. -your boss</p>
            `,
        friend: "",
    },
    2: {
        queue: 10,
        trolls: { date: 80, photo: 80 },
        message: `
                <h3>dear borderman:</h3>
                <p>we've received reports that people have been forging their passport photos, so watch out for that. <b>make sure the applicant's face matches the photo on their passport.</b> -your boss</p>
                <p>ps: if a passport has multiple errors, you only have to select one denial reason to deny them. -still your boss</p>
                <p>pps: your brother Barney is moving in with you tonight. -your all-knowing boss</p>
                `,
        friend: "Barney",
    },
    3: {
        queue: 10,
        trolls: { date: 90, photo: 90, place: 80, gender: 80, dob: 80 },
        message: `
                <h3>dear borderman:</h3>
                <p>after we cracked down on passport photo forgery yesterday, passport forgers managed to clean up their act. except for the fact that they will now give blatantly false information. you should be able to spot the fake stuff pretty easily, but keep an eye out. i'll give you a promotion if you get through today. -your boss</p>
                <p>pps: your sister Alyx is moving in with you tonight. -your all-knowing boss</p>
                `,
        friend: "Alyx",
    },
};

export { days };
