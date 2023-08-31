function fetchData() {
    const token = "pateoiLGxeeOa1bbO.7d97dd01a0d5282f7e4d3b5fff9c9e10d2023d3a34b1811e1152a97182c2238d"; // Remplacez par votre Bearer Token
    const headers = new Headers({
        "Authorization": `Bearer ${token}`
    });

    fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pages", {headers})
        .then(response => response.json())
        .then((data) => {
            console.log(data.records);
            for (const record of data.records) {
                let fields = record.fields;

                // cas des tags
                const tags_name = fields.tags_name;
                const tags_color = fields.tags_color;
                const tags_data = tags_name.map((tag_name, index) => {
                    return { tag_name: tag_name, tag_color: tags_color[index] };
                });

                createNewCard({
                    id: data.records.id,
                    name: fields.name,
                    description: fields.description,
                    img_url: fields.img_url,
                    tags_data: tags_data
                });
            }

        })
        .catch(error => console.error("Erreur lors de la récupération des données:", error));
}

// création de la carte + ajout des tags + ajout des events
function createNewCard(record) {
    const card_container = document.getElementById("card_container");
    const card_model = document.getElementById("card_0")
    const clone = card_model.cloneNode(true);

    clone.querySelector(".card_body h4").textContent = record.name;
    clone.querySelector(".card_body p").textContent = record.description;
    clone.querySelector(".card_header img").src = record.img_url;

    // event sur le score
    const card_header = clone.querySelector(".card_header");
    const rating = card_header.querySelector('.rating');
    const stars = rating.querySelectorAll('.star');
    let currentScore = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const parentCard = star.closest(".card");
            const old_value = parseInt(parentCard.getAttribute('rating'));
            let new_value = parseInt(star.getAttribute('data-value'));

            if (old_value == 1 && new_value == 1) {
                new_value=0;
            }
            parentCard.setAttribute("rating", new_value);
            updateStars(old_value, new_value);
        });
    });

    function updateStars(old_value, new_value) {
        stars.forEach((star, index) => {
            if (index <= new_value-1) {
                star.classList.add('bi-star-fill');
                star.classList.remove('bi-star');
            } else {
                star.classList.add('bi-star');
                star.classList.remove('bi-star-fill');
            }
        });
    }

    //tags
    const tags = clone.querySelector(".card_body .tags");
    for (const tag of record.tags_data) {
        let newSpan = document.createElement("span");
        newSpan.classList.add("tag");
        newSpan.innerHTML = tag.tag_name;
        newSpan.style.background = tag.tag_color;
        tags.appendChild(newSpan);
    }
    clone.style.display = "block";
    card_container.appendChild(clone);
}

fetchData();
