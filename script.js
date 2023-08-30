
function fetchData() {
	const token = "Votre_Bearer_Token"; // Remplacez par votre Bearer Token
	const headers = new Headers({
		"Authorization": `Bearer ${token}`
	});

	fetch("https://api.airtable.com/v0/app7zNJoX11DY99UA/Pages?maxRecords=5&view=Grid%20view", { headers })
		.then(response => response.json())
		.then(data => createDOMElements(data))
		.catch(error => console.error("Erreur lors de la récupération des données:", error));
}

function createNewCard(data) {
            const card__container = document.getElementById("card__container");
			const card__model = document.getElementById("card__0")

			const clone =  card__model.cloneNode(true);
			
			clone.querySelector(".card__body h4").textContent = data.name;
			clone.querySelector(".card__body p").textContent = data.description;
			clone.style.display="block";
			card__container.appendChild(clone);
}
		
createNewCard({id:"xx",name:"imelmi.net", description:"www.imelmi.net",tags:["blue","red","green"]});
createNewCard({id:"www",name:"google", description:"ask me anything",tags:["ok","go"]});