document.addEventListener("DOMContentLoaded", async function () {
    const token = "pateoiLGxeeOa1bbO.7d97dd01a0d5282f7e4d3b5fff9c9e10d2023d3a34b1811e1152a97182c2238d"; // Replace with your Bearer Token
    const headers = new Headers({
        "Authorization": `Bearer ${token}`
    });

    //** 1. on floute l'arrière-plan pendant les requêtes
    const spinnerContainer = document.getElementById("spinnerContainer"); // Define spinnerContainer here
    spinnerContainer.style.display = "block";

    //** 2. Création des tuiles
    function createNewPin(pinModel, record, tagsData) {
        const clone = pinModel.cloneNode(true);

        clone.id = record.id;
        clone.querySelector(".pin_body h4").textContent = record.fields.name;
        clone.querySelector(".pin_body .description").textContent = record.fields.description;
        clone.querySelector(".pin_body .url").textContent = record.fields.url;
        clone.querySelector(".pin_body .url").href = record.fields.url;
        clone.querySelector(".pin_header img").src = record.fields.img_url;
        clone.setAttribute("rating", record.fields.rating);

        const stars = clone.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const old_value = parseInt(clone.getAttribute('rating'));
                let new_value = parseInt(star.getAttribute('data-value'));

                if (old_value === 1 && new_value === 1) {
                    new_value = 0;
                }

                clone.setAttribute("rating", new_value);
                updateStars(stars, old_value, new_value);
            });
        });

        updateStars(stars, 0, record.fields.rating);

        const tags = clone.querySelector(".pin_body .tags");
        for (const tag of tagsData) {
            //
            const newSpan = document.createElement("span");
            newSpan.innerHTML = tag.tag_name;
            newSpan.style.background = tag.tag_color;
            newSpan.id = tag.tag_id
            newSpan.classList.add("tag");
            tags.appendChild(newSpan);
            //
            clone.classList.add(tag.tag_id);
        }

        clone.style.display = "block";
        return clone;
    }

    //** 2. Création des tuiles
    function createNewModal(modalModel, record, tagsData) {
        const clone = modalModel.cloneNode(true);

        clone.id = record.id;
        clone.querySelector(".title").textContent = record.fields.name;
        clone.querySelector(".description").textContent = record.fields.description;
        clone.querySelector("img").src = record.fields.img_url;
        clone.setAttribute("rating", record.fields.rating)

        return clone;
    }

    function updateStars(stars, old_value, new_value) {
        stars.forEach((star, index) => {
            if (index <= new_value - 1) {
                star.classList.add('bi-star-fill');
                star.classList.remove('bi-star');
            } else {
                star.classList.add('bi-star');
                star.classList.remove('bi-star-fill');
            }
        });
    }

    //** DATA ******************************
    async function getPinData() {
        try {
            const response = await fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins?view=Grid%20view", {headers});
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    }

    async function getTagData() {
        try {
            const response = await fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Tags?view=Grid%20view", {headers});
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
            //grid.init(data);
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    }

    //** FIN DATA **********************

    Promise.all([getPinData(), getTagData()])
        .then((results) => {
            try {
                // Handle the results of both promises
                const [pinData, tagData] = results; // Corrected variable names
                // Handle tags Data
                const sortedTags = tagData.records.toSorted((a, b) => {
                                            const nameA = a.fields.name.toLowerCase();
                                            const nameB = b.fields.name.toLowerCase();

                                            if (nameA < nameB) return -1;
                                            if (nameA > nameB) return 1;
                                            return 0;
                                        });
                const checkboxesContainer = document.getElementById("checkboxes_container");

                for (const tag of sortedTags) {
                    const tagItemDiv = document.createElement("div");
                    const tagItemInput = document.createElement("input");
                    const tagItemLabel = document.createElement("label");
                    tagItemInput.classList.add("form-check-input");
                    tagItemInput.type = "checkbox";
                    tagItemInput.value = "";
                    tagItemInput.id = tag.id;
                    tagItemInput.name = tag.fields.name;

                    tagItemLabel.setAttribute('for', tag.id)
                    tagItemLabel.innerHTML = tag.fields.name;
                    tagItemInput.name = tag.fields.name;
                    tagItemLabel.classList.add("form-check-label");

                    tagItemDiv.appendChild(tagItemInput);
                    tagItemDiv.appendChild(tagItemLabel);
                    tagItemDiv.classList.add("form-check");
                    checkboxesContainer.appendChild(tagItemDiv);
                }

                // Create pin
                const pinContainer = document.getElementById("pin_container");
                const pinModel = document.getElementById("pin_0");

                const modalContainer = document.getElementById("carousel-inner");
                const modalModel = document.getElementById("modal_0");

                let tagsData = [];
                for (const record of pinData.records) {
                    if (record.fields.tags_name != undefined && record.fields.tags_name.length > 0) {
                        tagsData = record.fields.tags_name.map((tag_name, index) => ({
                            tag_name: tag_name,
                            tag_color: record.fields.tags_color[index],
                            tag_id: record.fields.tag[index]
                        }));
                    }

                    const clonedPin = createNewPin(pinModel, record, tagsData);
                    pinContainer.appendChild(clonedPin);

                    const clonedModal = createNewModal(modalModel, record, tagsData)
                    modalContainer.appendChild(clonedModal);
                }

                console.log("Data loaded successfully.");

                //

            } catch (error) {
                console.error("Error fetching or processing data:", error);
            } finally {
                spinnerContainer.style.display = "none";
            }
        })
        .then(() => {
            // Get all checked checkboxes
            document.getElementById("checkboxes_container").addEventListener("change", filterPins);
            countTags ();
        })
        .catch((error) => {
            // Handle any errors that occurred in any of the promises
            console.error("An error occurred:", error);
        });

    function filterPins() {
        // Get all checked checkboxes
        const checkedCheckboxes = Array.from(document.querySelectorAll("input[type=checkbox]:checked"));
        // Get all pin elements
        const pins = Array.from(document.querySelectorAll(".pin"));

        const checkboxesIds = checkedCheckboxes.map((checkbox) => {
            return "." + checkbox.id
        });

        if (checkboxesIds.length == 0) {
            pins.forEach(pin => pin.style.display = "block");
        } else {
            const checkboxesList = checkboxesIds.join(",")
            const selectedPins = document.querySelectorAll(checkboxesList);
            pins.forEach(pin => pin.style.display = "none");
            selectedPins.forEach(pin => pin.style.display = "block");
        }
    }

    function countTags () {
        const visiblePinsTags = document.querySelectorAll('.pin:not([style="none"]) .tag');
        const visiblePinsTagsArray = [...visiblePinsTags];
        const tagsId = visiblePinsTagsArray.map((tag) => {return tag.id});

        const tagsCount = tagsId.reduce((acc, id) => {
            //const id = objet.id;
            if (!acc[id]) {
                acc[id] = 1; // Initialisez le compteur à 1 si c'est la première occurrence
            } else {
                acc[id]++; // Incrémentez le compteur si le nom existe déjà
            }
            return acc;
        }, {});

        const tagOccurences = Object.entries(tagsCount).map(([id, occurrences]) => ({ id, occurrences }));
        console.log (tagOccurences);

        const labelElements = {}; // Stockez les références aux éléments <label> par ID

        tagOccurences.forEach((tag) => {
            const tagId = tag.id;
            const tagLabel = labelElements[tagId]; // Récupérez l'élément <label> à partir du stockage
            if (tagLabel) {
                tagLabel.textContent = tagLabel.textContent + " (" + tag.occurrences + ")";
            }
        });

        // Remplissez l'objet labelElements avec les références aux éléments <label> au préalable
        tagOccurences.forEach((tag) => {
            const tagLabelObject = document.querySelector('label[for="' + tag.id + '"]');
            if (tagLabelObject) {
                labelElements[tag.id] = tagLabelObject;
            }
        });
            //pin.style.display = "block");


    }


});