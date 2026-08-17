/* =========================================
   SHARED CLOSET
========================================= */

const SHARED_ITEMS_KEY = "sharedClosetItems";
const SHARED_REQUESTS_KEY = "sharedClosetRequests";


// Get saved shared items
function getSharedItems() {
    return JSON.parse(
        localStorage.getItem(SHARED_ITEMS_KEY)
    ) || [];
}


// Get saved requests
function getSharedRequests() {
    return JSON.parse(
        localStorage.getItem(SHARED_REQUESTS_KEY)
    ) || [];
}


// Save requests
function saveSharedRequests(requests) {
    localStorage.setItem(
        SHARED_REQUESTS_KEY,
        JSON.stringify(requests)
    );
}


/* =========================================
   ELEMENTS
========================================= */

const browseGrid = document.getElementById("browseGrid");
const browseEmpty = document.getElementById("browseEmpty");

const requestsList = document.getElementById("requestsList");
const requestsEmpty = document.getElementById("requestsEmpty");

const myRequestsList = document.getElementById("myRequestsList");
const myRequestsEmpty = document.getElementById("myRequestsEmpty");

const tabs = document.querySelectorAll(".shared-tab");

const requestModal = document.getElementById("requestModal");
const closeRequestModal = document.getElementById("closeRequestModal");
const confirmRequest = document.getElementById("confirmRequest");
const requestItemPreview = document.getElementById("requestItemPreview");


let selectedItem = null;


/* =========================================
   TABS
========================================= */

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const selectedTab = tab.dataset.tab;

        // Remove active from all buttons
        tabs.forEach(button => {
            button.classList.remove("active");
        });

        // Add active to clicked button
        tab.classList.add("active");


        // Hide all sections
        document.querySelectorAll(".shared-tab-content")
            .forEach(section => {
                section.classList.remove("active");
            });


        // Show selected section
        if (selectedTab === "browse") {
            document.getElementById("browseTab")
                .classList.add("active");
        }

        if (selectedTab === "requests") {
            document.getElementById("requestsTab")
                .classList.add("active");

            renderIncomingRequests();
        }

        if (selectedTab === "my-requests") {
            document.getElementById("myRequestsTab")
                .classList.add("active");

            renderMyRequests();
        }

    });

});


/* =========================================
   BROWSE
========================================= */

function renderBrowse() {

    const items = getSharedItems();
    const requests = getSharedRequests();

    browseGrid.innerHTML = "";


    if (items.length === 0) {

        browseEmpty.style.display = "flex";
        return;

    }


    browseEmpty.style.display = "none";


    items.forEach(item => {

        const alreadyRequested = requests.some(
            request =>
                request.itemId === item.id &&
                request.requester === "currentUser"
        );


        const card = document.createElement("div");

        card.className = "shared-item-card";


        card.innerHTML = `
            <img
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
                class="shared-item-image"
            >

            <div class="shared-item-info">

                <div class="shared-item-name">
                    ${escapeHTML(item.name)}
                </div>

                <div class="shared-item-details">
                    ${escapeHTML(item.category || "")}
                    ${item.category && item.color ? " | " : ""}
                    ${escapeHTML(item.color || "")}
                    ${item.brand ? " | " + escapeHTML(item.brand) : ""}
                </div>

                <button
                    class="request-button ${alreadyRequested ? "requested" : ""}"
                    data-item-id="${item.id}"
                    ${alreadyRequested ? "disabled" : ""}
                >
                    ${alreadyRequested
                        ? "Request sent ✓"
                        : "Request item"
                    }
                </button>

            </div>
        `;


        if (!alreadyRequested) {

            const button = card.querySelector(".request-button");

            button.addEventListener("click", () => {

                openRequestModal(item);

            });

        }


        browseGrid.appendChild(card);

    });

}


/* =========================================
   OPEN REQUEST MODAL
========================================= */

function openRequestModal(item) {

    selectedItem = item;


    requestItemPreview.innerHTML = `
        <div class="modal-item-preview">

            <img
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
            >

            <strong>
                ${escapeHTML(item.name)}
            </strong>

        </div>
    `;


    requestModal.classList.add("show");

}


/* =========================================
   CLOSE REQUEST MODAL
========================================= */

closeRequestModal.addEventListener("click", () => {

    requestModal.classList.remove("show");

    selectedItem = null;

});


requestModal.addEventListener("click", event => {

    if (event.target === requestModal) {

        requestModal.classList.remove("show");

        selectedItem = null;

    }

});


/* =========================================
   SEND REQUEST
========================================= */

confirmRequest.addEventListener("click", () => {

    if (!selectedItem) return;


    const requests = getSharedRequests();


    const newRequest = {

        id: Date.now(),

        itemId: selectedItem.id,

        itemName: selectedItem.name,

        image: selectedItem.image,

        owner: selectedItem.owner || "Owner",

        requester: "currentUser",

        status: "awaiting",

        date: new Date().toISOString()

    };


    requests.push(newRequest);

    saveSharedRequests(requests);


    // Close modal
    requestModal.classList.remove("show");

    selectedItem = null;


    // Refresh Browse
    renderBrowse();


    // Switch to My Requests
    tabs.forEach(button => {
        button.classList.remove("active");
    });

    const myRequestsTabButton =
        document.querySelector('[data-tab="my-requests"]');

    myRequestsTabButton.classList.add("active");


    document.querySelectorAll(".shared-tab-content")
        .forEach(section => {
            section.classList.remove("active");
        });


    document.getElementById("myRequestsTab")
        .classList.add("active");


    renderMyRequests();

});


/* =========================================
   MY REQUESTS
========================================= */

function renderMyRequests() {

    const requests = getSharedRequests();

    const myRequests = requests.filter(
        request => request.requester === "currentUser"
    );


    myRequestsList.innerHTML = "";


    if (myRequests.length === 0) {

        myRequestsEmpty.style.display = "flex";
        return;

    }


    myRequestsEmpty.style.display = "none";


    myRequests.forEach(request => {

        const card = document.createElement("div");

        card.className = "my-request-card";


        card.innerHTML = `

            <div class="my-request-left">

                <img
                    src="${request.image}"
                    alt="${escapeHTML(request.itemName)}"
                    class="my-request-image"
                >

                <div>

                    <div class="my-request-name">
                        ${escapeHTML(request.itemName)}
                    </div>

                    <div class="my-request-description">
                        Your request to the owner
                    </div>

                </div>

            </div>

            <div class="request-status">
                ◷ Awaiting response
            </div>

        `;


        myRequestsList.appendChild(card);

    });

}


/* =========================================
   INCOMING REQUESTS
========================================= */

function renderIncomingRequests() {

    const requests = getSharedRequests();

    const incomingRequests = requests.filter(
        request => request.owner === "currentUser"
    );


    requestsList.innerHTML = "";


    if (incomingRequests.length === 0) {

        requestsEmpty.style.display = "flex";
        return;

    }


    requestsEmpty.style.display = "none";


    incomingRequests.forEach(request => {

        const card = document.createElement("div");

        card.className = "incoming-request-card";


        card.innerHTML = `

            <div class="incoming-request-left">

                <img
                    src="${request.image}"
                    alt="${escapeHTML(request.itemName)}"
                    class="incoming-request-image"
                >

                <div>

                    <div class="incoming-request-name">
                        ${escapeHTML(request.itemName)}
                    </div>

                    <div class="incoming-request-user">
                        Someone has requested this piece.
                    </div>

                </div>

            </div>

        `;


        requestsList.appendChild(card);

    });

}


/* =========================================
   SECURITY / TEXT CLEANING
========================================= */

function escapeHTML(value) {

    if (!value) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   INITIALISE
========================================= */

renderBrowse();
renderMyRequests();
renderIncomingRequests();
