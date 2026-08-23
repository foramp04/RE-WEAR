// signup.js

import {
    auth,
    createUserWithEmailAndPassword,
    updateProfile
} from "./firebase.js";

import {
    createUserStorage,
    saveProfile
} from "./storage.js";


const signupForm =
    document.getElementById("signup-form");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const signupButton =
    document.getElementById("signup-btn");


signupForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!name) {

            alert(
                "Please enter your name."
            );

            return;

        }


        if (!email) {

            alert(
                "Please enter your email."
            );

            return;

        }


        if (password.length < 6) {

            alert(
                "Your password must be at least 6 characters."
            );

            return;

        }


        try {

            signupButton.disabled = true;

            signupButton.textContent =
                "Creating account...";


            console.log(
                "SIGNUP: starting..."
            );


            // create firebase acc
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            console.log(
                "SIGNUP: Firebase account created",
                user.uid
            );


            // save name to firebase 
            await updateProfile(
                user,
                {
                    displayName: name
                }
            );


            console.log(
                "SIGNUP: name saved"
            );


            // local storage for user
            createUserStorage();


            console.log(
                "SIGNUP: storage created"
            );


            // save profile 
            saveProfile({

                name:
                    name,

                email:
                    user.email,

                photo:
                    ""

            });


            console.log(
                "SIGNUP: profile saved"
            );


            // dashboard direct
            window.location.assign(
                "dashboard.html"
            );


        } catch (error) {

            console.error(
                "SIGNUP ERROR:",
                error
            );


            alert(
                "Sign up failed:\n\n" +
                error.code +
                "\n\n" +
                error.message
            );


            signupButton.disabled = false;

            signupButton.textContent =
                "Sign Up";

        }

    }
);
