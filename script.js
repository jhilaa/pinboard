document.addEventListener("DOMContentLoaded", async function () {
        const token = "pateoiLGxeeOa1bbO.7d97dd01a0d5282f7e4d3b5fff9c9e10d2023d3a34b1811e1152a97182c2238d"; // Replace with your Bearer Token
        const headers = new Headers({
            "Authorization": `Bearer ${token}`
        });

        //** on floute l'arrière-plan pendant les requêtes
        const spinnerContainer = document.getElementById("spinnerContainer"); // Define spinnerContainer here
        spinnerContainer.style.display = "block";

        //** click sur les étoiles
        async function updateRating(id, rating) {

            method = "PATCH";
            postData = {
                "fields": {
                    "rating": rating.toString()
                }
            }
            try {
                //const response = await fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins", {
                const response = await fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins/" + id, {
                    method: method,
                    headers: {
                        "Authorization": " Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postData)
                });
                const responseData = await response.json()
                console.log(responseData)
            } catch (error) {
                console.error("Error making POST request:", error);
            }
        }

        async function updateStatus(id, status) {
            method = "PATCH";
            postData = {
                "fields": {
                    "status": status.toString()
                }
            }
            try {
                //const response = await fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins", {
                const response = await fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins/" + id, {
                    method: method,
                    headers: {
                        "Authorization": " Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postData)
                });
                const responseData = await response.json()
                console.log(responseData)
            } catch (error) {
                console.error("Error making POST request:", error);
            }
        }

        //** Création des tuiles
        function createPin(pinModel, record, tagsData) {
            const clone = pinModel.cloneNode(true);

            clone.id = record.id;
            clone.querySelector(".pin_body h4").textContent = record.fields.name;
            clone.querySelector(".pin_body .description").textContent = record.fields.description;
            clone.querySelector(".pin_body .url").textContent = record.fields.url;
            clone.querySelector(".pin_body .url").href = record.fields.url;
            clone.querySelector(".pin_header img").src = record.fields.img_url;
            clone.setAttribute("rating", record.fields.rating);
            clone.setAttribute("status", record.fields.status);


            const pin_header = clone.querySelector(".pin_header")
            pin_header.addEventListener("click", (e) => {
                const pinElement = e.target.closest(".pin");
                const carouselItemActive = document.querySelector(".carousel-item.active");
                const carouselItem = document.querySelector(".carousel-item#" + pinElement.id);
                if (carouselItemActive !== null) {
                    carouselItemActive.classList.remove("active");
                }
                if (carouselItem !== null) {
                    carouselItem.classList.add("active");
                }
            })

            const pin_status = clone.querySelector(".pin_status")
            if (record.fields.status==undefined) {
                pin_status.classList.add("bi-exclamation-circle");
            }
            if (record.fields.status=="0" || record.fields.status=="") {
                pin_status.classList.add("bi-exclamation-circle");
            }
            else {
                pin_status.classList.remove("bi-exclamation-circle");
            }

            pin_status.addEventListener("click", async (e) => {
                e.stopPropagation();
                const pinElement = e.target.closest(".pin");
                const previous_status = pinElement.getAttribute("status");
                let new_status;
                if (previous_status =="0") {
                    new_status = 1;
                    pinElement.setAttribute("status","1");
                    pin_status.classList.remove("bi-exclamation-circle");
                }
                else {
                    new_status = 0;
                    pinElement.setAttribute("status","0");
                    pin_status.classList.add("bi-exclamation-circle");
                }

                const spinnerPinContainerElement = pinElement.querySelector(".spinnerPinContainer");
                spinnerPinContainerElement.style.display = "flex";
                await updateStatus(pinElement.id, new_status);
                spinnerPinContainerElement.style.display = "none";
                /*
                const pinElement = e.target.closest(".pin");
                const carouselItemActive = document.querySelector(".carousel-item.active");
                const carouselItem = document.querySelector(".carousel-item#" + pinElement.id);
                if (carouselItemActive !== null) {
                    carouselItemActive.classList.remove("active");
                }
                if (carouselItem !== null) {
                    carouselItem.classList.add("active");
                }
                */
            })

            const pin_rating_stars = clone.querySelectorAll('.pin .rating .star');
            pin_rating_stars.forEach((star, index) => {
                star.addEventListener('click', async (e) => {
                    e.stopPropagation()
                    const old_value = parseInt(clone.getAttribute('rating'));
                    let new_value = parseInt(star.getAttribute('data-value'));

                    if (old_value === 1 && new_value === 1) {
                        new_value = 0;
                    }

                    clone.setAttribute("rating", new_value);
                    updateStarsDisplay(pin_rating_stars, old_value, new_value);

                    //const spinnerPinContainerElement = e.target.closest(".spinnerPinContainer");
                    const pinElement = e.target.closest(".pin");
                    const spinnerPinContainerElement = pinElement.querySelector(".spinnerPinContainer");
                    spinnerPinContainerElement.style.display = "flex";
                    await updateRating(pinElement.id, new_value);
                    spinnerPinContainerElement.style.display = "none";


                });
            });

            updateStarsDisplay(pin_rating_stars, 0, record.fields.rating);


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

        //** Création des slides la modal
        function createSlide(record) {
            const modalCarouselItem = document.createElement("div");
            modalCarouselItem.classList.add("carousel-item");
            modalCarouselItem.id = record.id;

            const modalDivText = document.createElement("div");
            modalDivText.classList.add("text-center");

            const modalDivTitleBlock = document.createElement("div");
            modalDivTitleBlock.classList.add("d-flex", "flex-row", "justify-content-center");

            const modalDivTitle = document.createElement("p");
            modalDivTitle.classList.add("title");
            modalDivTitle.textContent = record.fields.name;

            const modalDivRating = document.createElement("div");
            modalDivRating.classList.add("d-flex", "flex-row", "ml-2");

            for (let i = 1; i <= 4; i++) {
                const star = document.createElement("p");
                star.classList.add("bi", "bi-star", "star")
                if (i == 4) {
                    star.classList.add("gold");
                }
                if (record.fields.rating >= i) {
                    star.classList.add("bi-star-fill");
                    star.classList.remove("bi-star");
                }
                modalDivRating.appendChild(star)
            }

            const modal_rating_stars = modalDivRating.querySelectorAll('bi-star');
            updateStarsDisplay(modal_rating_stars, 0, record.fields.rating);

            const modalDivImg = document.createElement("img");
            modalDivImg.classList.add("carousel-img");
            modalDivImg.src = record.fields.img_url

            const ModalDivDescription = document.createElement("p");
            ModalDivDescription.classList.add("description");
            ModalDivDescription.textContent = record.fields.description;

            modalDivTitleBlock.appendChild(modalDivTitle);
            modalDivTitleBlock.appendChild(modalDivRating);

            modalDivText.appendChild(modalDivTitleBlock);
            modalDivText.appendChild(modalDivImg);
            modalDivText.appendChild(ModalDivDescription);
            modalCarouselItem.appendChild(modalDivText)
            return modalCarouselItem;
        }

        //** Mise à jour des étoiles
        function updateStarsDisplay(stars, old_value, new_value) {
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

        //** PIN DATA ******************************
        async function getPinData() {
            try {
                //const response = await fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins", {headers});
                const response = await fetch("https://pinboard-wizard.glitch.me/api");
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching or processing data:", error);
            }
        }

        function getDataFromPin(pinObject) {
            return {
                id: pinObject.id,
                fields: {
                    name: pinObject.querySelector(".name").textContent,
                    description: pinObject.querySelector(".description").textContent,
                    img_url: pinObject.querySelector(".pin_image").src,
                    rating: pinObject.getAttribute('rating'),
                    status: pinObject.getAttribute('status'),
                    tags: []
                }

            }
        }

        //** TAG DATA ******************************
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

        async function createTagCheckboxes(tagData) {
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
        }

        async function createPins(pinData) {
            const pinModel = document.getElementById("pin_0");
            const pinContainer = document.getElementById("pin_container");
            for (const record of pinData.records) {
                if (record.fields.tags_name != undefined && record.fields.tags_name.length > 0) {
                    tagsData = record.fields.tags_name.map((tag_name, index) => ({
                        tag_name: tag_name.replace(" ", "&nbsp;"),
                        tag_color: record.fields.tags_color[index],
                        tag_id: record.fields.tag[index]
                    }));
                }

                const clonedPin = createPin(pinModel, record, tagsData);
                pinContainer.appendChild(clonedPin);
            }
        }

        async function createModalSlides() {
            const visiblePins = document.querySelectorAll('.pin:not([style*="display: none"]):not(#pin_0)');
            const visiblePinsTagsArray = [...visiblePins];

            const modalContainer = document.getElementById("carousel-inner");

            let records = visiblePinsTagsArray.map(pin => {
                return getDataFromPin(pin);
            })

            modalContainer.innerHTML = "";
            for (const record of records) {
                if (record != undefined && record.fields.name != undefined) {
                    const newSlide = createSlide(record, tagsData)
                    modalContainer.appendChild(newSlide);
                }
            }
        }

//** INITIALISATION ************************
        Promise.all([getPinData(), getTagData()])
            .then(async (results) => {
                try {
                    // Handle the results of both promises
                    const [pinData, tagData] = results; // Corrected variable names
                    // Handle tags Data
                    await createTagCheckboxes(tagData);

                    // Create pin and modal
                    await createPins(pinData);

                    await createModalSlides();


                    console.log("Data loaded successfully.");

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
                        countPinsByTag();
                        countPins();
                    });
                countPinsByTag();
                countPins();
                createModalSlides();

                document.getElementById("text-input").addEventListener("change",
                    async () => {
                        //await filterPinsAnd();
                        await filterPins();
                        countPinsByTag();
                        countPins();
                    }
                )
            })
            .catch((error) => {
                // Handle any errors that occurred in any of the promises
                console.error("An error occurred:", error);
            });

//** FILTRE *****************************/

        function intersection(array1, array2) {
            const set1 = new Set(array1);
            const set2 = new Set(array2);
            return [...set1].filter(element => set2.has(element));
        }

        function ratingComparaison(pinRating, ratingValue, ratingOperator) {
            if (ratingOperator == 1) {
                return (pinRating > ratingValue)
            }
            if (ratingOperator == 2) {
                return (pinRating >= ratingValue)
            }
            if (ratingOperator == 3) {
                return (pinRating == ratingValue)
            }
            if (ratingOperator == 4) {
                return (pinRating <= ratingValue)
            }
            if (ratingOperator == 5) {
                return (pinRating < ratingValue)
            }
        }

        function searchInputText(text, pin) {
            const name = pin.querySelector(".name").textContent;
            const url = pin.querySelector(".url").textContent;
            const description = pin.querySelector(".description").textContent;
            let tagsLabel = "";
            const tags = Array.from(pin.querySelector(".tag"))
            tags.forEach((tag) => {
                tagsLabel.concat(tag.name);
            })
            const concatLabels = name.concat(url, description, tagsLabel);

            if (text == "" || text == undefined || concatLabels == "") {
                return true
            }
            if (concatLabels.includes(text)) {
                return true;
            }
            return false;
        }

        async function filterPins() {
            // les fiches
            const pins = Array.from(document.querySelectorAll(".pin:not(#pin_0)"));
            // filtre sur les mots-clé
            const checkedCheckboxes = Array.from(document.querySelectorAll("input[type=checkbox]:checked"));
            // filtre sur la note
            const ratingOperator = parseInt(document.getElementById("rating-operator").value);
            const ratingValue = parseInt(document.querySelector("#sidebar .rating").getAttribute("filter_value"));
            // filtre sur les libellés
            const textInputValue = document.getElementById("text-input").value;
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
                const pinRating = parseInt(pin.getAttribute("rating"));
                const ratingTest = ratingComparaison(pinRating, ratingValue, ratingOperator);
                const tagsIntersection = intersection(tagsIds, selectedCriteria)
                const inputTextFound = searchInputText(textInputValue.toLowerCase(), pin);


                if (tagsIntersection.length == selectedCriteria.length
                    && ratingTest && inputTextFound) {
                    pin.style.display = "block";
                } else {
                    pin.style.display = "none";
                }

            });

            //mise à jour du nombre de fiches sur les tags
            countPinsByTag()
            countPins();
            createModalSlides();
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
                const slide = document.querySelector("#" + pin.id + ".carousel-item");
                // Affichez ou masquez l'élément .pin en fonction du résultat
                if (shouldShow) {
                    pin.style.display = "block";
                    slide.classList.remove("d-none");
                } else {
                    pin.style.display = "none";
                    slide.classList.add("d-none");
                }
            });

        }

        function countPins() {
            const visiblePins = document.querySelectorAll('.pin:not([style*="display: none"]):not(#pin_0)');
            const visiblePinsTagsArray = [...visiblePins];

            const starCountElement = document.getElementById("starCount");
            starCountElement.textContent = "(" + visiblePinsTagsArray.length + ")";
        }

        function countPinsByTag() {
            //--
            const visiblePinsTags = document.querySelectorAll('.pin:not([style*="display: none"]) .tag');
            const visiblePinsTagsArray = [...visiblePinsTags];
            const visiblePinsTagsIds = visiblePinsTagsArray.map((tag) => {
                return tag.id
            });

            // pour les tags
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
                        labelElement.innerHTML = labelElement.getAttribute("name") + "<span class=\"tagCount\"> (" + tag.count + ")</span>";
                    }

                }
            });
        }

//** gestion des événement pour les filtres
        const rating_operator = document.getElementById("rating-operator");
        rating_operator.addEventListener("change",
            async () => {
                //await filterPinsAnd();
                await filterPins();
                countPinsByTag();
                countPins();
            })

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
                updateStarsDisplay(filter_stars, old_value, new_value);
                filterPins();

            });
        });
    }
)
;