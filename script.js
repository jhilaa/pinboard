document.addEventListener("DOMContentLoaded", async function () {
    const token = "pateoiLGxeeOa1bbO.7d97dd01a0d5282f7e4d3b5fff9c9e10d2023d3a34b1811e1152a97182c2238d"; // Replace with your Bearer Token
    const headers = new Headers({
        "Authorization": `Bearer ${token}`
    });

    //** on floute l'arrière-plan pendant les requêtes
    const spinnerContainer = document.getElementById("spinnerContainer"); // Define spinnerContainer here
    spinnerContainer.style.display = "block";

    //** Création des tuiles
    function createNewPin(pinModel, record, tagsData) {
        const clone = pinModel.cloneNode(true);

        clone.id = record.id;
        clone.querySelector(".pin_body h4").textContent = record.fields.name;
        clone.querySelector(".pin_body .description").textContent = record.fields.description;
        clone.querySelector(".pin_body .url").textContent = record.fields.url;
        clone.querySelector(".pin_body .url").href = record.fields.url;
        clone.querySelector(".pin_header img").src = record.fields.img_url;
        clone.setAttribute("rating", record.fields.rating);

        const rating_stars = clone.querySelectorAll('.rating .star');
        rating_stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const old_value = parseInt(clone.getAttribute('rating'));
                let new_value = parseInt(star.getAttribute('data-value'));

                if (old_value === 1 && new_value === 1) {
                    new_value = 0;
                }

                clone.setAttribute("rating", new_value);
                updateStars(rating_stars, old_value, new_value);
            });
        });

        updateStars(rating_stars, 0, record.fields.rating);

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

    //** Création de la modale
    function createNewModal(modalModel, record, tagsData) {
        const clone = modalModel.cloneNode(true);

        clone.id = record.id;
        clone.querySelector(".title").textContent = record.fields.name;
        clone.querySelector(".description").textContent = record.fields.description;
        clone.querySelector("img").src = record.fields.img_url;
        clone.setAttribute("rating", record.fields.rating)

        return clone;
    }

    //** gestion des étoiles
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


    //** INITIALISATION ************************
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
                    tagItemLabel.setAttribute('name', tag.fields.name);
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
                            tag_name: tag_name.replace(" ", "&nbsp;"),
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
            //document.getElementById("checkboxes_container").addEventListener("change", filterPinsOr);
            document.getElementById("checkboxes_container").addEventListener("change",
                async () => {
                    //await filterPinsAnd();
                    await filterPins();
                    countTags()
                });
            countTags();
        })
        .catch((error) => {
            // Handle any errors that occurred in any of the promises
            console.error("An error occurred:", error);
        });

    //** FILTRE ******************************
    function filterPinsOr() {
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

    function intersection(array1, array2) {
        const set1 = new Set(array1);
        const set2 = new Set(array2);
        return [...set1].filter(element => set2.has(element));
    }

    async function filterPins() {
        // les fiches
        const pins = Array.from(document.querySelectorAll(".pin:not(#pin_0)"));
        // filtre sur les mots-clé
        const checkedCheckboxes = Array.from(document.querySelectorAll("input[type=checkbox]:checked"));
        // filtre sur la note
        const ratingValue = parseInt(document.querySelector("#sidebar .rating").getAttribute("filter_value"));

        // Parcours des cases à cocher pour obtenir les critères sélectionnés
        const selectedCriteria = [];
        checkedCheckboxes.forEach(function (checkbox) {
                selectedCriteria.push(checkbox.id);
            }
        );

        // Parcours des éléments .pin et vérifiez s'ils correspondent aux critères sélectionnés
        pins.forEach(function (pin) {
            // tag
            const tags = Array.from(pin.querySelectorAll(".tag"))
            const tagsIds = tags.map(tag => {
                return tag.id
            })
            const tagsIntersection = intersection(tagsIds, selectedCriteria)
            let toShow = tagsIntersection.length == selectedCriteria.length;

            // note
            const pinRating = parseInt(pin.getAttribute("rating"));
            toShow = toShow && (pinRating == ratingValue)
            //let toShow = (pinRating == ratingValue);

            // Affichez ou masquez l'élément .pin en fonction du résultat
            if (toShow) {
                pin.style.display = "block";
            } else {
                pin.style.display = "none";
            }
        });

        //mise à jour du nombre de fiches sur les tags
        countTags()
    }

    async function filterPinsAnd() {
        // Get all checked checkboxes
        const checkedCheckboxes = Array.from(document.querySelectorAll("input[type=checkbox]:checked"));
        // Get all pin elements
        const pins = Array.from(document.querySelectorAll(".pin:not(#pin_0)"));

        // Parcourez les cases à cocher pour obtenir les critères sélectionnés
        const selectedCriteria = [];
        checkedCheckboxes.forEach(function (checkbox) {
                selectedCriteria.push(checkbox.id);
            }
        );

        // Parcourez les éléments .pin et vérifiez s'ils correspondent aux critères sélectionnés
        pins.forEach(function (pin) {
            const tags = Array.from(pin.querySelectorAll(".tag"))
            const tagsIds = tags.map(tag => {
                return tag.id
            })
            const tagsIntersection = intersection(tagsIds, selectedCriteria)
            const shouldShow = tagsIntersection.length == selectedCriteria.length;
            console.log(shouldShow);
            // Affichez ou masquez l'élément .pin en fonction du résultat
            if (shouldShow) {
                pin.style.display = "block";
            } else {
                pin.style.display = "none";
            }
        });

    }

    function countTags() {
        //--
        const visiblePinsTags = document.querySelectorAll('.pin:not([style*="display: none"]) .tag');
        const visiblePinsTagsArray = [...visiblePinsTags];
        const visiblePinsTagsIds = visiblePinsTagsArray.map((tag) => {
            return tag.id
        });

        const visiblePinsTagsCount = visiblePinsTagsIds.reduce((acc, id) => {
            //const id = objet.id;
            if (!acc[id]) {
                acc[id] = 1; // Initialisez le compteur à 1 si c'est la première occurrence
            } else {
                acc[id]++; // Incrémentez le compteur si le nom existe déjà
            }
            return acc;
        }, {});

        const visiblePinsTagsCountById = Object.entries(visiblePinsTagsCount).map(([id, count]) => ({id, count}));
        //
        const tagCheckboxesLabel = document.getElementsByClassName("form-check-label");
        const tagCheckboxesLabelArray = [...tagCheckboxesLabel];
        const tagCheckboxesLabelForAttribute = tagCheckboxesLabelArray.map(checkbox => {
            return checkbox.getAttribute("for")
        });

        const allTagCheckboxesWithCount = tagCheckboxesLabelForAttribute.map((tagId1) => {
            const idInVisiblePinsTagsCountById = visiblePinsTagsCountById.find((id) => id.id === tagId1);
            return idInVisiblePinsTagsCountById ? {
                id: idInVisiblePinsTagsCountById.id,
                count: idInVisiblePinsTagsCountById.count
            } : {id: tagId1, count: 0};
        });


        allTagCheckboxesWithCount.forEach(tag => {
            const labelForId = tag.id;
            const labelElement = document.querySelector(`label[for="${labelForId}"]`);

            if (labelElement) {
                // Mettre à jour le contenu textuel de l'objet label
                //labelElement.textContent = `${labelElement.textContent} (${tag.count})`;
                if (tag.count == 0) {
                    labelElement.classList.add("tagCount0");
                    //labelElement.textContent = labelElement.getAttribute("name");
                    labelElement.innerHTML = labelElement.getAttribute("name");
                } else {
                    labelElement.classList.remove("tagCount0");
                    //labelElement.textContent = labelElement.getAttribute("name") + " (" + tag.count + ")";
                    labelElement.innerHTML = labelElement.getAttribute("name") + "<span class=\"tagCount\"> (" + tag.count + ")<\span>";
                }

            }
        });
    }

    //** gestion des événement pour les filtres
    const filter_stars = document.querySelectorAll('#sidebar .star');
    filter_stars.forEach((star, index) => {
        star.addEventListener('click', (e) => {
            e.preventDefault();
            const rating_filter = e.target.closest(".rating");
            const old_value = parseInt(rating_filter.getAttribute('filter_value'));
            let new_value = parseInt(star.getAttribute('data-value'));

            if (old_value === 1 && new_value === 1) {
                new_value = 0;
            }

            document.querySelector("#sidebar .rating").setAttribute("filter_value", new_value);
            updateStars(filter_stars, old_value, new_value);
            filterPins();

        });
    });
});