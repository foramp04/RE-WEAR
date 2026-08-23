import {
    auth,
    onAuthStateChanged
} from "./firebase.js";

export function getCurrentUser() {

    return auth.currentUser;

}


// wait for auth = current user

export function waitForCurrentUser() {

    return new Promise(resolve => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                user => {

                    unsubscribe();

                    resolve(user);

                }
            );

    });

}


// storage key for currrent user

export function userKey(key) {

    const user =
        auth.currentUser;

    if (!user) {

        return null;

    }

    return `rewear_${user.uid}_${key}`;

}


// save data

export function saveUserData(key, data) {

    const storageKey =
        userKey(key);

    if (!storageKey) {

        console.error(
            "Could not save data: no user is currently logged in."
        );

        return false;

    }

    try {

        localStorage.setItem(
            storageKey,
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save user data:",
            error
        );

        return false;

    }

}


// get data

export function getUserData(
    key,
    defaultValue = []
) {

    const storageKey =
        userKey(key);

    if (!storageKey) {

        console.error(
            "Could not load data: no user is currently logged in."
        );

        return defaultValue;

    }

    try {

        const saved =
            localStorage.getItem(storageKey);

        if (saved === null) {

            return defaultValue;

        }

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not read user data:",
            error
        );

        return defaultValue;

    }

}


// profile

export function saveProfile(profile) {

    return saveUserData(
        "profile",
        profile
    );

}


export function getProfile() {

    return getUserData(
        "profile",
        {}
    );

}


// create user storage

export function createUserStorage() {

    const user =
        auth.currentUser;

    if (!user) {

        console.error(
            "Cannot create storage: no user is logged in."
        );

        return false;

    }


    const storageItems = {

        profile: {
            name: "",
            email: user.email || "",
            photo: ""
        },

        wardrobe: [],

        outfits: [],

        calendar: [],

        shared: [],

        requests: []

    };


    try {

        Object.entries(
            storageItems
        ).forEach(
            ([key, defaultValue]) => {

                const storageKey =
                    userKey(key);

                if (
                    localStorage.getItem(
                        storageKey
                    ) === null
                ) {

                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(
                            defaultValue
                        )
                    );

                }

            }
        );

        return true;

    } catch (error) {

        console.error(
            "Could not create user storage:",
            error
        );

        return false;

    }

}
