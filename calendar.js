/* =========================================================
RE:WEAR — CALENDAR JAVASCRIPT
========================================================= */


/* =========================================================
ELEMENTS
========================================================= */

const calendarGrid =
    document.getElementById("calendarGrid");

const monthTitle =
    document.getElementById("monthTitle");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const logOutfitButton =
    document.getElementById("logOutfitButton");

const modal =
    document.getElementById("modal");

const closeModalButton =
    document.getElementById("closeModal");

const selectedDateText =
    document.getElementById("selectedDate");

const outfitSelection =
    document.getElementById("outfitSelection");

const noOutfitsMessage =
    document.getElementById("noOutfitsMessage");

const confirmLogButton =
    document.getElementById("confirmLogButton");

const goOutfitsButton =
    document.getElementById("goOutfitsButton");

const navItems =
    document.querySelectorAll(".nav-item");

const signOutButton =
    document.getElementById("signOutButton");


/* =========================================================
CALENDAR DATA
========================================================= */


/*
    Start on the current month.

    This means when the page is opened in August 2026,
    it will automatically show August 2026.
*/

let currentDate = new Date();

let currentYear =
    currentDate.getFullYear();

let currentMonth =
    currentDate.getMonth();


/*
    The date currently being logged.
*/

let selectedDate = null;


/*
    The outfit currently selected in the modal.
*/

let selectedOutfitId = null;


/*
    Logged outfits are stored separately from
    the outfits themselves.

    Example:

    {
        "2026-08-15": 123456789,
        "2026-08-20": 987654321
    }
*/

let loggedOutfits = loadLoggedOutfits();


/* =========================================================
LOAD LOGGED OUTFITS
========================================================= */

function loadLoggedOutfits() {

    const saved =
        localStorage.getItem("rewearCalendar");

    if (!saved) {
        return {};
    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not load calendar data.",
            error
        );

        return {};
    }
}


/* =========================================================
SAVE LOGGED OUTFITS
========================================================= */

function saveLoggedOutfits() {

    localStorage.setItem(
        "rewearCalendar",
        JSON.stringify(loggedOutfits)
    );
}


/* =========================================================
LOAD OUTFITS
========================================================= */


/*
    IMPORTANT:

    The Calendar does NOT create outfits.

    It only reads outfits created on the
    Outfits page.

    Your Outfits page should save them using:

    localStorage.setItem(
        "rewearOutfits",
        JSON.stringify(outfits)
    );
*/

function getSavedOutfits() {

    const saved =
        localStorage.getItem("rewearOutfits");

    if (!saved) {
        return [];
    }


    try {

        const outfits =
            JSON.parse(saved);

        if (!Array.isArray(outfits)) {
            return [];
        }

        return outfits;

    } catch (error) {

        console.error(
            "Could not load outfits.",
            error
        );

        return [];
    }
}


/* =========================================================
MONTH NAME
========================================================= */

function getMonthName(month) {

    return new Date(
        currentYear,
        month,
        1
    ).toLocaleString(
        "default",
        {
            month: "long"
        }
    );
}


/* =========================================================
FORMAT DATE
========================================================= */

function formatDate(year, month, day) {

    const formattedMonth =
        String(month + 1).padStart(2, "0");

    const formattedDay =
        String(day).padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
}


/* =========================================================
RENDER CALENDAR
========================================================= */

function renderCalendar() {

    monthTitle.textContent =
        `${getMonthName(currentMonth)} ${currentYear}`;


    calendarGrid.innerHTML = "";


    /*
        JavaScript gives Sunday = 0.

        We want Monday = 0.

        So we convert it here.
    */

    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();


    const mondayStart =
        firstDay === 0
            ? 6
            : firstDay - 1;


    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();


    /*
        Empty cells before the first day.
    */

    for (
        let i = 0;
        i < mondayStart;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.className =
            "calendar-day empty";

        calendarGrid.appendChild(
            emptyDay
        );
    }


    /*
        Actual days.
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        createCalendarDay(day);
    }
}


/* =========================================================
CREATE CALENDAR DAY
========================================================= */

function createCalendarDay(day) {

    const date =
        formatDate(
            currentYear,
            currentMonth,
            day
        );


    const calendarDay =
        document.createElement("div");

    calendarDay.className =
        "calendar-day";


    const dateNumber =
        document.createElement("span");

    dateNumber.className =
        "date-number";

    dateNumber.textContent =
        day;


    calendarDay.appendChild(
        dateNumber
    );


    /*
        Check whether an outfit has already
        been logged on this date.
    */

    const loggedOutfitId =
        loggedOutfits[date];


    if (loggedOutfitId) {

        const outfit =
            findOutfitById(
                loggedOutfitId
            );


        if (outfit) {

            const loggedButton =
                document.createElement("button");

            loggedButton.className =
                "logged-outfit";

            loggedButton.textContent =
                outfit.name || "Outfit";


            loggedButton.addEventListener(
                "click",
                function() {

                    openLogModal(date);

                }
            );


            calendarDay.appendChild(
                loggedButton
            );


        } else {

            /*
                If the outfit was deleted from
                the Outfits page, remove its
                calendar entry.
            */

            delete loggedOutfits[date];

            saveLoggedOutfits();

            addEmptyDayButton(
                calendarDay,
                date
            );
        }


    } else {

        addEmptyDayButton(
            calendarDay,
            date
        );
    }


    calendarGrid.appendChild(
        calendarDay
    );
}


/* =========================================================
EMPTY DAY BUTTON
========================================================= */

function addEmptyDayButton(
    calendarDay,
    date
) {

    const addButton =
        document.createElement("button");

    addButton.className =
        "day-add";

    addButton.textContent =
        "+";


    addButton.setAttribute(
        "aria-label",
        `Log outfit for ${date}`
    );


    addButton.addEventListener(
        "click",
        function() {

            openLogModal(date);

        }
    );


    calendarDay.appendChild(
        addButton
    );
}


/* =========================================================
FIND OUTFIT
========================================================= */

function findOutfitById(id) {

    const outfits =
        getSavedOutfits();


    return outfits.find(
        outfit =>
            String(outfit.id) === String(id)
    );
}


/* =========================================================
OPEN LOG MODAL
========================================================= */

function openLogModal(date) {

    selectedDate = date;

    selectedOutfitId = null;


    selectedDateText.textContent =
        date;


    modal.classList.add("open");

    document.body.style.overflow =
        "hidden";


    loadOutfitsIntoModal();
}


/* =========================================================
LOAD OUTFITS INTO MODAL
========================================================= */

function loadOutfitsIntoModal() {

    const outfits =
        getSavedOutfits();


    outfitSelection.innerHTML = "";


    /*
        NO OUTFITS
    */

    if (outfits.length === 0) {

        outfitSelection.style.display =
            "none";

        noOutfitsMessage.style.display =
            "block";

        confirmLogButton.disabled =
            true;

        return;
    }


    /*
        OUTFITS EXIST
    */

    outfitSelection.style.display =
        "flex";

    noOutfitsMessage.style.display =
        "none";

    confirmLogButton.disabled =
        true;


    outfits.forEach(
        outfit => {

            const option =
                document.createElement("button");

            option.type =
                "button";

            option.className =
                "outfit-option";


            /*
                Thumbnail.

                We do NOT upload anything here.

                If the outfit has an image,
                we use that existing image.

                Otherwise we simply show
                a placeholder.
            */

            let thumbnailHTML =
                `<span class="outfit-placeholder">−</span>`;


            if (outfit.image) {

                thumbnailHTML = `
                    <img
                        src="${outfit.image}"
                        alt=""
                    >
                `;

            }


            option.innerHTML = `

                <div class="outfit-thumbnail">

                    ${thumbnailHTML}

                </div>

                <span class="outfit-name">

                    ${escapeHTML(
                        outfit.name || "Unnamed outfit"
                    )}

                </span>

            `;


            option.addEventListener(
                "click",
                function() {

                    /*
                        Remove selection from
                        every other outfit.
                    */

                    document
                        .querySelectorAll(
                            ".outfit-option"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    option.classList.add(
                        "selected"
                    );


                    selectedOutfitId =
                        outfit.id;


                    confirmLogButton.disabled =
                        false;

                }
            );


            outfitSelection.appendChild(
                option
            );

        }
    );
}


/* =========================================================
CLOSE MODAL
========================================================= */

function closeModal() {

    modal.classList.remove(
        "open"
    );

    document.body.style.overflow =
        "";

    selectedDate = null;

    selectedOutfitId = null;
}


closeModalButton.addEventListener(
    "click",
    closeModal
);


/*
    Close when clicking outside
    the modal.
*/

modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


/*
    Escape key.
*/

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("open")
        ) {

            closeModal();

        }

    }
);


/* =========================================================
LOG OUTFIT
========================================================= */

confirmLogButton.addEventListener(
    "click",
    function() {

        /*
            Safety check.
        */

        if (
            !selectedDate ||
            !selectedOutfitId
        ) {

            return;
        }


        /*
            Make sure the outfit still exists.

            This prevents an invalid outfit
            from being logged.
        */

        const outfit =
            findOutfitById(
                selectedOutfitId
            );


        if (!outfit) {

            alert(
                "This outfit no longer exists. Please create a new outfit on the Outfits page."
            );

            closeModal();

            renderCalendar();

            return;
        }


        /*
            Save outfit against the date.
        */

        loggedOutfits[selectedDate] =
            selectedOutfitId;


        saveLoggedOutfits();


        closeModal();


        renderCalendar();

    }
);


/* =========================================================
TOP LOG OUTFIT BUTTON
========================================================= */

logOutfitButton.addEventListener(
    "click",
    function() {

        /*
            Opens today's date.
        */

        const today =
            new Date();


        const todayDate =
            formatDate(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );


        openLogModal(
            todayDate
        );

    }
);


/* =========================================================
GO TO OUTFITS
========================================================= */

goOutfitsButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "outfits.html";

    }
);


/* =========================================================
MONTH NAVIGATION
========================================================= */

previousMonth.addEventListener(
    "click",
    function() {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

        }


        renderCalendar();

    }
);


nextMonth.addEventListener(
    "click",
    function() {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

        }


        renderCalendar();

    }
);


/* =========================================================
SIDEBAR NAVIGATION
========================================================= */

navItems.forEach(
    button => {

        button.addEventListener(
            "click",
            function() {

                const page =
                    button.dataset.page;


                if (!page) {
                    return;
                }


                window.location.href =
                    page;

            }
        );

    }
);


/* =========================================================
SIGN OUT
========================================================= */

signOutButton.addEventListener(
    "click",
    function() {

        const confirmed =
            confirm(
                "Are you sure you want to sign out?"
            );


        if (!confirmed) {
            return;
        }


        alert(
            "Sign out will be connected when authentication is set up."
        );

    }
);


/* =========================================================
SECURITY HELPER
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
START CALENDAR
========================================================= */

renderCalendar();
