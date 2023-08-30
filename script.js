function fetchData() {
    const token = "pateoiLGxeeOa1bbO.7d97dd01a0d5282f7e4d3b5fff9c9e10d2023d3a34b1811e1152a97182c2238d"; // Remplacez par votre Bearer Token
    const headers = new Headers({
        "Authorization": `Bearer ${token}`
    });

    fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pages?maxRecords=5&view=Grid%20view", {headers})
        .then(response => response.json())
        .then((data) => {
            console.log(data.records);
            for (const record of data.records) {
                let fields = record.fields
                createNewCard({
                    id: data.records.id,
                    name: fields.name,
                    description: fields.description,
                    img_url: fields.img_url,
                    tags: ["rose", "jaune", "orange"]
                });
            }

        })
        .catch(error => console.error("Erreur lors de la récupération des données:", error));
}

function createNewCard(record) {
    const card__container = document.getElementById("card__container");
    const card__model = document.getElementById("card__0")
    const clone = card__model.cloneNode(true);

    clone.querySelector(".card__body h4").textContent = record.name;
    clone.querySelector(".card__body p").textContent = record.description;
    clone.querySelector(".card__header img").src = record.img_url;

    //const tagsList = record....
    const tagsList = [{name:"php", color:"blue"}, {name:"mimi", color:"cat"}]
    const tags = clone.querySelector(".card__body .tags");
    for (const tag of tagsList) {
        let newSpan = document.createElement("span");
        newSpan.classList.add("tag");
        newSpan.innerHTML = tag.name;
        newSpan.style.background = "brown";
        tags.appendChild(newSpan);
    }
    clone.style.display = "block";
    card__container.appendChild(clone);
}

fetchData();
