import {
    auth,
    signOut,
    onAuthStateChanged
} from "./firebase.js";

import {
    getProfile,
    saveProfile,
    getUserData
} from "./storage.js";


//elements

const profilePhoto =
    document.getElementById("profilePhoto");

const defaultProfileIcon =
    document.getElementById("defaultProfileIcon");

const profilePhotoInput =
    document.getElementById("profilePhotoInput");

const emailInput =
    document.getElementById("email");

const displayNameInput =
    document.getElementById("displayName");

const saveProfileButton =
    document.getElementById("saveProfile");

const saveMessage =
    document.getElementById("saveMessage");

const wardrobeCount =
    document.getElementById("wardrobeCount");

const outfitCount =
    document.getElementById("outfitCount");

const donatedCount =
    document.getElementById("donatedCount");

const signOutButton =
    document.querySelector(".sign-out");


//load profile data

function loadProfile() {

    const profile =
        getProfile();


    emailInput.value =
        profile.email || auth.currentUser?.email || "";


    displayNameInput.value =
        profile.name || "";


    if (profile.photo) {

        profilePhoto.src =
            profile.photo;

        profilePhoto.style.display =
            "block";

        defaultProfileIcon.style.display =
            "none";

    } else {

        profilePhoto.style.display =
            "none";

        defaultProfileIcon.style.display =
            "flex";

    }

}

//change profile photo

profilePhotoInput.addEventListener(
    "change",
    function() {

        const file =
            this.files[0];

        if (!file) return;


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                const photo =
                    event.target.result;


                profilePhoto.src =
                    photo;

                profilePhoto.style.display =
                    "block";

                defaultProfileIcon.style.display =
                    "none";


                const profile =
                    getProfile();


                profile.photo =
                    photo;


                saveProfile(profile);

            };


        reader.readAsDataURL(file);

    }
);


//save profile chnanges

saveProfileButton.addEventListener(
    "click",
    function() {

        const currentProfile =
            getProfile();


        const profile = {

            name:
                displayNameInput.value.trim(),

            email:
                emailInput.value.trim(),

            photo:
                currentProfile.photo || ""

        };


        saveProfile(profile);


        saveMessage.textContent =
            "Your profile has been saved.";


        setTimeout(
            () => {

                saveMessage.textContent =
                    "";

            },
            2500
        );

    }
);


//profile summary: outfits, wardrobe, donated items

function updateSummary() {

    const wardrobe =
        getUserData(
            "wardrobe",
            []
        );


    const outfits =
        getUserData(
            "outfits",
            []
        );


    const keptItems =
        wardrobe.filter(
            item =>
                item.destination !== "donate"
        );


    const donatedItems =
        wardrobe.filter(
            item =>
                item.destination === "donate"
        );


    wardrobeCount.textContent =
        keptItems.length;


    outfitCount.textContent =
        outfits.length;


    donatedCount.textContent =
        donatedItems.length;

}

//sign out button

signOutButton.addEventListener(
    "click",
    async function(event) {

        event.preventDefault();


        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(
                "Sign out failed:",
                error
            );

        }

    }
);


//auth check

onAuthStateChanged(
    auth,
    function(user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        loadProfile();

        updateSummary();

    }
);
