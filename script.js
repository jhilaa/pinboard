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
            const newSpan = document.createElement("span");
            newSpan.classList.add("tag");
            newSpan.innerHTML = tag.tag_name;
            newSpan.style.background = tag.tag_color;
            tags.appendChild(newSpan);
        }

        clone.style.display = "block";
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
                const pinContainer = document.getElementById("pin_container");
                const pinModel = document.getElementById("pin_0");
                let tagsData = [];
                for (const record of pinData.records) {
                    if (record.fields.tags_name != undefined && record.fields.tags_name.length > 0) {
                        tagsData = record.fields.tags_name.map((tag_name, index) => ({
                            tag_name: tag_name,
                            tag_color: record.fields.tags_color[index]
                        }));
                    }

                    const clonedPin = createNewPin(pinModel, record, tagsData);
                    pinContainer.appendChild(clonedPin);
                }

                console.log("Data loaded successfully.");
            } catch (error) {
                console.error("Error fetching or processing data:", error);
            } finally {
                spinnerContainer.style.display = "none";
            }
        })
        .catch((error) => {
            // Handle any errors that occurred in any of the promises
            console.error("An error occurred:", error);
        });
});