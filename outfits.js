document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================= */

    const newOutfitBtn = document.getElementById("newOutfitBtn");

    const modal = document.getElementById("outfitModal");

    const closeModal = document.getElementById("closeModal");

    const saveOutfitBtn = document.getElementById("saveOutfitBtn");

    const outfitGrid = document.getElementById("outfitGrid");

    const trayItems = document.getElementById("trayItems");

    const dropZone = document.getElementById("dropZone");

    const selectedItemsContainer =
        document.getElementById("selectedItems");

    const dropMessage =
        document.getElementById("dropMessage");

    const outfitName =
        document.getElementById("outfitName");

    const outfitNotes =
        document.getElementById("outfitNotes");

    const outfitError =
        document.getElementById("outfitError");



    /* =========================
       STORAGE
    ========================= */

    let outfits =
        JSON.parse(localStorage.getItem("rewearOutfits")) || [];



    /*
       This is where we get the user's wardrobe.

       Your wardrobe page should eventually save pieces
       using the same "rewearWardrobe" key.

       If you haven't connected the wardrobe yet,
       the example pieces below will appear instead.
    */

    let wardrobe =
        JSON.parse(localStorage.getItem("rewearWardrobe")) || [];


    /* =========================
       EXAMPLE WARDROBE
       REMOVE THIS WHEN YOUR
       WARDROBE IS CONNECTED
    ========================= */

    if (wardrobe.length === 0) {

        wardrobe = [
            {
                id: "sample-jeans",
                name: "Blue Jeans",
                category: "Bottom",
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
            },

            {
                id: "sample-shirt",
                name: "White Shirt",
                category: "Top",
                image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=400"
            },

            {
                id: "sample-jacket",
                name: "Green Jacket",
                category: "Outerwear",
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"
            },

            {
                id: "sample-skirt",
                name: "Denim Skirt",
                category: "Bottom",
                image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400"
            }
        ];

    }



    /* =========================
       RENDER OUTFITS
    ========================= */

    function renderOutfits() {

        outfitGrid.innerHTML = "";


        /* NO OUTFITS */

        if (outfits.length === 0) {

            const emptyState =
                document.createElement("div");

            emptyState.className = "empty-state";

            emptyState.innerHTML = `
                <div class="empty-state-icon">
                    ♧
                </div>

                <h2>No outfits yet</h2>

                <p>
                    Create your first curated look using pieces from your wardrobe.
                </p>
            `;

            outfitGrid.appendChild(emptyState);

            return;
        }


        /* OUTFITS EXIST */

        outfits.forEach(outfit => {

            const card =
                document.createElement("div");

            card.className = "outfit-card";


            let previewHTML = "";


            if (
                outfit.items &&
                outfit.items.length > 0
            ) {

                outfit.items
                    .slice(0, 3)
                    .forEach(item => {

                        previewHTML += `
                            <img
                                src="${item.image}"
                                alt="${escapeHTML(item.name)}"
                            >
                        `;

                    });

            }
            else {

                previewHTML = `
                    <div class="empty-state-icon">
                        ♧
                    </div>
                `;

            }


            card.innerHTML = `

                <div class="outfit-preview">
                    ${previewHTML}
                </div>

                <div class="outfit-card-name">
                    ${escapeHTML(outfit.name)}
                </div>

            `;


            outfitGrid.appendChild(card);

        });

    }



    /* =========================
       RENDER WARDROBE TRAY
    ========================= */

    function renderWardrobeTray() {

        trayItems.innerHTML = "";


        if (wardrobe.length === 0) {

            trayItems.innerHTML = `
                <div class="tray-empty">
                    Your wardrobe is empty.
                    <br><br>
                    Add some pieces first.
                </div>
            `;

            return;
        }


        wardrobe.forEach(item => {

            const itemElement =
                document.createElement("div");

            itemElement.className = "tray-item";

            itemElement.draggable = true;

            itemElement.dataset.id = item.id;


            itemElement.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${escapeHTML(item.name)}"
                >

                <div class="tray-item-name">
                    ${escapeHTML(item.name)}
                </div>

            `;


            /* DRAG START */

            itemElement.addEventListener(
                "dragstart",
                event => {

                    event.dataTransfer.setData(
                        "text/plain",
                        item.id
                    );

                    itemElement.style.opacity = "0.5";
                }
            );


            /* DRAG END */

            itemElement.addEventListener(
                "dragend",
                () => {

                    itemElement.style.opacity = "1";

                }
            );


            /* CLICK TO ADD */

            itemElement.addEventListener(
                "click",
                () => {

                    addItemToOutfit(item.id);

                }
            );


            trayItems.appendChild(itemElement);

        });

    }



    /* =========================
       OPEN MODAL
    ========================= */

    function openModal() {

        modal.classList.add("show");

        document.body.style.overflow = "hidden";

        outfitError.textContent = "";

        outfitName.focus();

    }



    /* =========================
       CLOSE MODAL
    ========================= */

    function closeOutfitModal() {

        modal.classList.remove("show");

        document.body.style.overflow = "";

        resetCreator();

    }



    /* =========================
       RESET CREATOR
    ========================= */

    function resetCreator() {

        outfitName.value = "";

        outfitNotes.value = "";

        selectedItemsContainer.innerHTML = "";

        outfitError.textContent = "";

        updateDropMessage();

    }



    /* =========================
       ADD ITEM TO OUTFIT
    ========================= */

    function addItemToOutfit(itemId) {

        const item =
            wardrobe.find(
                wardrobeItem =>
                    wardrobeItem.id === itemId
            );


        if (!item) {
            return;
        }


        /*
           Prevent the same item from being
           added twice.
        */

        const alreadyAdded =
            selectedItemsContainer.querySelector(
                `[data-id="${itemId}"]`
            );


        if (alreadyAdded) {
            return;
        }


        const selectedItem =
            document.createElement("div");

        selectedItem.className = "selected-item";

        selectedItem.dataset.id = item.id;


        selectedItem.innerHTML = `

            <button
                class="remove-item"
                type="button"
                aria-label="Remove ${escapeHTML(item.name)}"
            >
                ×
            </button>

            <img
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
            >

            <div class="selected-item-name">
                ${escapeHTML(item.name)}
            </div>

        `;


        /* REMOVE BUTTON */

        selectedItem
            .querySelector(".remove-item")
            .addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    selectedItem.remove();

                    updateDropMessage();

                }
            );


        selectedItemsContainer.appendChild(
            selectedItem
        );


        updateDropMessage();

    }



    /* =========================
       DROP ZONE
    ========================= */

    dropZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            dropZone.classList.add("drag-over");

        }
    );


    dropZone.addEventListener(
        "dragleave",
        event => {

            /*
               Prevent flickering when moving
               between children.
            */

            if (!dropZone.contains(event.relatedTarget)) {

                dropZone.classList.remove(
                    "drag-over"
                );

            }

        }
    );


    dropZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            dropZone.classList.remove(
                "drag-over"
            );


            const itemId =
                event.dataTransfer.getData(
                    "text/plain"
                );


            if (itemId) {

                addItemToOutfit(itemId);

            }

        }
    );



    /* =========================
       DROP MESSAGE
    ========================= */

    function updateDropMessage() {

        const numberOfItems =
            selectedItemsContainer
                .children
                .length;


        if (numberOfItems === 0) {

            dropMessage.style.display =
                "flex";

        }
        else {

            dropMessage.style.display =
                "none";

        }

    }



    /* =========================
       SAVE OUTFIT
    ========================= */

    function saveOutfit() {

        const name =
            outfitName.value.trim();


        if (!name) {

            outfitError.textContent =
                "Please give your outfit a name.";

            outfitName.focus();

            return;

        }


        const selectedIds =
            Array.from(
                selectedItemsContainer.children
            )
            .map(
                element =>
                    element.dataset.id
            );


        if (selectedIds.length === 0) {

            outfitError.textContent =
                "Add at least one wardrobe piece to your outfit.";

            return;

        }


        const selectedPieces =
            selectedIds
                .map(
                    id =>
                        wardrobe.find(
                            item => item.id === id
                        )
                )
                .filter(Boolean);


        const newOutfit = {

            id:
                "outfit-" +
                Date.now(),

            name: name,

            notes:
                outfitNotes.value.trim(),

            items:
                selectedPieces,

            createdAt:
                new Date().toISOString()

        };


        outfits.push(newOutfit);


        localStorage.setItem(
            "rewearOutfits",
            JSON.stringify(outfits)
        );


        renderOutfits();

        closeOutfitModal();

    }



    /* =========================
       ESCAPE MODAL
    ========================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeOutfitModal();

            }

        }
    );



    /* =========================
       CLICK OUTSIDE MODAL
    ========================= */

    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                closeOutfitModal();

            }

        }
    );



    /* =========================
       BUTTON EVENTS
    ========================= */

    newOutfitBtn.addEventListener(
        "click",
        openModal
    );


    closeModal.addEventListener(
        "click",
        closeOutfitModal
    );


    saveOutfitBtn.addEventListener(
        "click",
        saveOutfit
    );



    /* =========================
       SIGN OUT
    ========================= */

    document
        .getElementById("signOut")
        .addEventListener(
            "click",
            event => {

                event.preventDefault();

                /*
                   Firebase sign-out will go here
                   once authentication is connected.
                */

                window.location.href =
                    "login.html";

            }
        );



    /* =========================
       ESCAPE HTML
    ========================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text ?? "";

        return div.innerHTML;

    }


    renderOutfits();

    renderWardrobeTray();

    updateDropMessage();

});
