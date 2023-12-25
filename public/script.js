document.addEventListener("DOMContentLoaded", async function () {
        const token = "pateoiLGxeeOa1bbO.7d97dd01a0d5282f7e4d3b5fff9c9e10d2023d3a34b1811e1152a97182c2238d"; // Replace with your Bearer Token
        const headers = new Headers({
            "Authorization": `Bearer ${token}`,
        });

        //** on floute l'arrière-plan pendant les requêtes
        const spinnerContainer = document.getElementById("spinnerContainer"); // Define spinnerContainer here
        spinnerContainer.style.display = "block";

        const domainRadiosList = document.getElementById("domain_radios_list");
        const domainInput = document.getElementById("domain-input");
        const domainLinkToggle = document.getElementById('domain_link_toggle');

        function setCookie(cookieName, cookieValue) {
            const d = new Date();
            const expirationDays=50;
            d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
            //document.cookie = "domain=value; domain=localhost; path=/";
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);
            //document.cookie = cookieName+"="+cookieValue+"; expires=Fri, 31 Dec 9999 23:59:59 GMT; Path=/";
            document.cookie = cookieName+"="+cookieValue+"; Path=/";
        }

        function getCookie(cookieName) {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

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

        function triggerDomainInputChangeEvent() {
            const event = new Event('change', {
                bubbles: true,  // Permet à l'événement de se propager (peut être utile dans certains cas).
                cancelable: true // Permet d'annuler l'événement si nécessaire.
            });
            // Déclenchez l'événement sur l'élément input.
            domainInput.dispatchEvent(event);

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
            clone.setAttribute("mini_url", record.fields.mini_url);
            clone.setAttribute("domain", record.fields.domain);

            const pin_header = clone.querySelector(".pin_header");
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
            if (record.fields.status == undefined) {
                pin_status.classList.add("btn-green");
                pin_status.classList.remove("btn-green");
            }
            if (record.fields.status == "0" || record.fields.status == "") {
                pin_status.classList.add("btn-green");
                pin_status.classList.remove("btn-green");
            } else {
                pin_status.classList.remove("btn-green")
                pin_status.classList.add("btn-green");
            }

            pin_status.addEventListener("click", async (e) => {
                e.stopPropagation();
                const pinElement = e.target.closest(".pin");
                const previous_status = pinElement.getAttribute("status");
                let new_status;
                if (previous_status == "0") {
                    new_status = 1;
                    pinElement.setAttribute("status", "1");
                    pin_status.classList.remove("btn-green");
                    pin_status.classList.add("btn-green");
                } else {
                    new_status = 0;
                    pinElement.setAttribute("status", "0");
                    pin_status.classList.add("btn-green");
                    pin_status.classList.remove("btn-green");
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

            const globe = clone.querySelector(".bi-globe");
            globe.addEventListener("click", (e) => {
                const pinElement = e.target.closest(".pin");
                const mini_url_attribute = pinElement.getAttribute("mini_url");
                const mini_url_input = document.getElementById("mini-url-input");

                if (mini_url_input.value == mini_url_attribute) {
                    mini_url_input.value = "";
                } else {
                    mini_url_input.value = mini_url_attribute;
                }
                /******************/
                const event = new Event('change', {
                    bubbles: true,  // Permet à l'événement de se propager (peut être utile dans certains cas).
                    cancelable: true // Permet d'annuler l'événement si nécessaire.
                });
                // Déclenchez l'événement sur l'élément input.
                mini_url_input.dispatchEvent(event);
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
        async function getPinData(domain) {
            try {
                //const apiUrl = `https://api.airtable.com/v0/app7zNJoX11DY99UA/Pins?filterByFormula=` + encodeURIComponent(`AND({domain_name}="` + domain + `")`);
                const apiUrl = `https://pinboard-hqnx.onrender.com/api/domain/`+domain+`/pins`;

                const response = await fetch(apiUrl, {headers});
                //const response = await fetch("https://pinboard-hqnx.onrender.com/api/pins", {headers});
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
        async function getTagData(domain) {
            try {
                //const apiUrl = `https://pinboard-hqnx.onrender.com/api/tag/all`;
                const apiUrl = `https://pinboard-hqnx.onrender.com/api/domain/`+domain+`/tags`;

                const response = await fetch(apiUrl, {headers});
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

        //** GROUP DATA ******************************
        async function getGroupData(domain) {
            try {
                //onst apiUrl = `https://pinboard-hqnx.onrender.com/api/domain/`+domain+`/groups`;
                const apiUrl = `https://pinboard-hqnx.onrender.com/api/domain/Maths/groups`;

                const response = await fetch(apiUrl, {headers});
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

        //** DOMAIN DATA ******************************
        async function getDomainData() {
            try {
                const apiUrl = `https://pinboard-hqnx.onrender.com/api/domain/all`;
                const response = await fetch(apiUrl, {headers});
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

        async function createTagCheckboxes(tagData, domain) {
            const sortedTags = tagData.records.toSorted((a, b) => {
                const nameA = a.fields.name.toLowerCase();
                const nameB = b.fields.name.toLowerCase();

                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            const tagCheckboxesList = document.getElementById("tag_checkboxes_list");
            tagCheckboxesList.innerHTML = "";

            for (const tag of sortedTags) {
                const tagItemDiv = document.createElement("li");
                const tagItemInput = document.createElement("input");
                const tagItemLabel = document.createElement("label");
                tagItemInput.classList.add("form-check-input");
                tagItemInput.type = "checkbox";
                tagItemInput.value = "";
                tagItemInput.id = tag.id;
                tagItemInput.name = tag.fields.name;

                tagItemLabel.setAttribute('for', tag.id)
                //tagItemLabel.innerHTML = tag.fields.name;
                tagItemLabel.setAttribute('name', tag.fields.name);
                tagItemLabel.classList.add("form-check-label");

                tagItemDiv.appendChild(tagItemInput);
                tagItemDiv.appendChild(tagItemLabel);
                tagItemDiv.classList.add("form-check");
                tagCheckboxesList.appendChild(tagItemDiv);
            }
        }

        async function createDomainRadios(domainData, domain) {
            const domainArray = domainData.records.map((record) => {
                return record.fields.name
            })
            const sortedDomains = new Set(domainArray.sort());

            for (const domain of sortedDomains) {
                const domainItemDiv = document.createElement("div");
                const domainItemInput = document.createElement("input");
                const domainItemLabel = document.createElement("label");
                domainItemInput.classList.add("form-check-input");
                domainItemInput.type = "radio";
                domainItemInput.id = domain;
                domainItemInput.name = "domain";
                domainItemInput.value = domain;
                if (domain == domainCookie) {
                    domainItemInput.checked=true;
                    domainInput.value = domain;
                }

                domainItemInput.addEventListener('click', (e) => {
                    const domainCheckbox = e.target;
                    if (domainCheckbox.value == domainInput.value) {
                        //domainCheckbox.checked = false
                        //domainInput.value = "";
                        domainCheckbox.checked = true;
                    } else {
                        domainInput.value = domainCheckbox.value;
                        setCookie("selectedDomain", domainInput.value);
                        triggerDomainInputChangeEvent();
                    }
                });

                domainItemLabel.setAttribute('for', domain)
                domainItemLabel.setAttribute('name', domain)
                domainItemLabel.innerHTML = domain;
                domainItemLabel.classList.add("form-check-label");

                domainItemDiv.appendChild(domainItemInput);
                domainItemDiv.appendChild(domainItemLabel);
                domainItemDiv.classList.add("form-check");
                domainRadiosList.appendChild(domainItemDiv);
            }
        }

        async function createUrlRadios(pinData) {
            const urlArray = pinData.records.map((record) => {
                return record.fields.mini_url
            })
            const sortedUrls = new Set(urlArray.sort());
            const urlRadiosList = document.getElementById("url_radios_list");
            urlRadiosList.innerHTML = "";

            for (const url of sortedUrls) {
                const urlItemDiv = document.createElement("div");
                const urlItemInput = document.createElement("input");
                const urlItemLabel = document.createElement("label");
                urlItemInput.classList.add("form-check-input");
                urlItemInput.type = "radio";
                urlItemInput.id = url;
                urlItemInput.name = "url";
                urlItemInput.value = url;

                urlItemInput.addEventListener('click', (e) => {
                    const urlCheckbox = e.target;
                    const urlInput = document.getElementById("mini-url-input");
                    if (urlCheckbox.value == urlInput.value) {
                        urlCheckbox.checked = false
                        urlInput.value = "";
                    } else {
                        urlInput.value = urlCheckbox.value;
                    }

                    const event = new Event('change', {
                        bubbles: true,  // Permet à l'événement de se propager (peut être utile dans certains cas).
                        cancelable: true // Permet d'annuler l'événement si nécessaire.
                    });
                    // Déclenchez l'événement sur l'élément input.
                    urlInput.dispatchEvent(event);
                });

                urlItemLabel.setAttribute('for', url)
                urlItemLabel.setAttribute('name', url)
                urlItemLabel.innerHTML = url;
                urlItemLabel.classList.add("form-check-label");

                urlItemDiv.appendChild(urlItemInput);
                urlItemDiv.appendChild(urlItemLabel);
                urlItemDiv.classList.add("form-check");
                urlRadiosList.appendChild(urlItemDiv);
            }
        }

         function createGroupTree(groupData) {
             function trouverFils(array, parent) {
                let children = [];
                if (Array.isArray(array)) {
                    array.forEach(record => {
                        const fields = record.fields;
                        if (Array.isArray(fields.Group) && fields.Group.length >0) {
                            if (parent == fields.Group[0]) {
                                children.push({
                                    id: record.id,
                                    text: fields.name,
                                    children: trouverFils(array, record.id)
                                });
                            }
                        }
                    });
                }
                return children;
            }

            try {
                let result = trouverFils(groupData.records, "recqhM5UDTNnUVvaL");
                // Exemple d'utilisation avec les données fournies
                console.log("-groupData-----------");
                console.log(groupData.records);
                console.log("-trouverFils-----------");
                console.log(result);

                let tree = new Tree('#group_checkboxes_list', {
                    data: result,
                    closeDepth: 3,
                    loaded: function () {
                        this.values = [];
                        this.disables = [];
                    },
                    onChange: function () {
                        console.log(this.values);
                    }
                });
            } catch (error) {
                console.error("Error fetching or processing data:", error);
            }
        }

        async function createPins(pinData) {
            const pinModel = document.getElementById("pin_0");
            const pinContainer = document.getElementById("pin_container");
            pinContainer.innerHTML = "";
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

        async function handleDomainChoice(domain) {
            if (domain != "" && domain != undefined) {
                spinnerContainer.style.display = "block";
                Promise.all([getPinData(domain), getTagData(domain), getGroupData(domain)])
                    .then(async (results) => {
                        try {
                            // Handle the results of both promises
                            const [pinData, tagData, groupData] = results; // Corrected variable names
                            // Handle tags Data
                            await createTagCheckboxes(tagData);
                            await createUrlRadios(pinData);
                            await createGroupTree(groupData)
                            // Create pin and modal
                            await createPins(pinData);
                            await createModalSlides();
                            await filterPins();
                            countPinsByTag();
                            countPinsByUrl();
                            countPins();
                            console.log("Data loaded successfully.");

                        } catch (error) {
                            console.error("Error fetching or processing data:", error);
                        } finally {
                            spinnerContainer.style.display = "none";
                        }
                    })
                    .then(() => {
                        setCookie("selectedDomain", domain); //,30)
                    })
                    .then(() => {
                        const clickEvent = new Event('click', {
                            bubbles: true,  // Permet à l'événement de se propager (peut être utile dans certains cas).
                            cancelable: true // Permet d'annuler l'événement si nécessaire.
                        });
                        domainLinkToggle.dispatchEvent(clickEvent);
                    })
            }
            else {
                const clickEvent = new Event('click', {
                    bubbles: true,  // Permet à l'événement de se propager (peut être utile dans certains cas).
                    cancelable: true // Permet d'annuler l'événement si nécessaire.
                });
                domainLinkToggle.dispatchEvent(clickEvent);
                setCookie("selectedDomain", "")
            }
        }


//** INITIALISATION ************************
        //Promise.all([getPinData(), getTagData()])
        //Promise.all([getPinData(), getTagData(), getDomainData()])
        const domainCookie = getCookie("selectedDomain");
        getDomainData()
            .then(async (results) => {
                try {
                    // Handle the results of both promises
                    //const [pinData, tagData, domainData] = results; // Corrected variable names
                    const domainData = results; // Corrected variable names
                    await createDomainRadios(domainData, domainCookie);
                    console.log("Data loaded successfully.");

                } catch (error) {
                    console.error("Error fetching or processing data:", error);
                } finally {
                    spinnerContainer.style.display = "none";
                }
            })
            .then(() => {
                domainInput.addEventListener("change",
                    async () => {
                        const domain = domainInput.value;
                        await handleDomainChoice(domain)
                    }
                )
                document.getElementById("mini-url-input").addEventListener("change",
                    async () => {
                        await filterPins();
                        countPinsByTag();
                        countPinsByUrl();
                        countPins();
                    }
                )
                // Get all checked checkboxes
                //document.getElementById("checkboxes_container").addEventListener("change", filterPinsOr);
                document.getElementById("tag_checkboxes_container").addEventListener("change",
                    async () => {
                        //await filterPinsAnd();
                        await filterPins();
                        countPinsByTag();
                        countPinsByUrl();
                        countPins();
                    });
                countPinsByTag();
                countPinsByUrl();
                countPins();
                createModalSlides();

                document.getElementById("text-input").addEventListener("change",
                    async () => {
                        //await filterPinsAnd();
                        await filterPins();
                        countPinsByTag();
                        countPinsByUrl();
                        countPins();
                    }
                )

                /*
                document.getElementById("text-input").addEventListener("change",
                    async () => {
                        await filterPins();
                        countPinsByTag();
                        countPinsByUrl();
                        countPins();
                    }
                )

                 */

                document.getElementById("mini-url-input").addEventListener("change",
                    async () => {
                        await filterPins();
                        countPinsByTag();
                        countPinsByUrl();
                        countPins();
                    }
                )
            })
            .then(() => {
                triggerDomainInputChangeEvent()
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
            const concatLabels = (name.concat(url, description, tagsLabel)).toLowerCase();

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
            // filtre sur l'url
            const miniUrlInputValue = document.getElementById("mini-url-input").value;
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
                const miniUrlMatch = (miniUrlInputValue == "" || pin.getAttribute("mini_url") == miniUrlInputValue);


                if (tagsIntersection.length == selectedCriteria.length
                    && ratingTest && inputTextFound && miniUrlMatch) {
                    pin.style.display = "block";
                } else {
                    pin.style.display = "none";
                }

                if (miniUrlInputValue != "") {
                    pin.querySelector(".funnel").classList.add("bi-funnel-fill");
                    pin.querySelector(".funnel").classList.remove("bi-funnel");
                } else {
                    pin.querySelector(".funnel").classList.remove("bi-funnel-fill");
                    pin.querySelector(".funnel").classList.add("bi-funnel");
                }

            });

            //mise à jour du nombre de fiches sur les tags
            countPinsByTag()
            countPinsByUrl()
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
            //const tagCheckboxesLabel = document.getElementsByClassName("form-check-label");
            const tagCheckboxesLabel = document.querySelectorAll("#tag_checkboxes_list .form-check-label");
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

        function countPinsByUrl() {
            //--
            const visiblePins = document.querySelectorAll('.pin:not([style*="display: none"])');
            const visiblePinsArray = [...visiblePins];
            const visiblePinsUrls = visiblePinsArray.map((pin) => {
                return pin.getAttribute("mini_url");
            });

            // pour les urls
            const visiblePinsUrlsCount = visiblePinsUrls.reduce((acc, url) => {
                //const id = objet.id;
                if (!acc[url]) {
                    acc[url] = 1; // Initialisez le compteur à 1 si c'est la première occurrence
                } else {
                    acc[url]++; // Incrémentez le compteur si le nom existe déjà
                }
                return acc;
            }, {});

            const visiblePinsCountByUrl = Object.entries(visiblePinsUrlsCount).map(([url, count]) => ({url, count}));
            //
            const urlRadiosLabel = document.querySelectorAll("#url_radios_list .form-check-label");
            const urlRadiosLabelArray = [...urlRadiosLabel];

            urlRadiosLabelArray.forEach(radioLabel => {
                const urlNbOccurences = visiblePinsCountByUrl.find(element => element.url === radioLabel.getAttribute("for"));
                if (urlNbOccurences == undefined) {
                    radioLabel.classList.add("urlCount0");
                    radioLabel.innerHTML = radioLabel.getAttribute("name");
                } else {
                    radioLabel.classList.remove("urlCount0");
                    //labelElement.textContent = labelElement.getAttribute("name") + " (" + tag.count + ")";
                    radioLabel.innerHTML = radioLabel.getAttribute("name") + "<span class=\"urlCount\"> (" + urlNbOccurences.count + ")</span>";

                }
            })
        }

//** gestion des événement pour les filtres
        const rating_operator = document.getElementById("rating-operator");
        rating_operator.addEventListener("change",
            async () => {
                await filterPins();
                countPinsByTag();
                countPinsByUrl();
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
