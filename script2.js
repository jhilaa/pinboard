const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    const card_header = card.querySelector(".card_header");
    const rating = card_header.querySelector('.rating');
    const stars = rating.querySelectorAll('.star');
    let currentScore = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            //const value = parseInt(star.getAttribute('data-value'));
            console.log("forEach");
            //updateStars(value);
        });
    });

    function updateStars(value) {
        console.log("updateStars : " + value);
        currentScore = value;
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('bi-star-fill');
                star.classList.remove('bi-star');
            } else {
                star.classList.add('bi-star');
                star.classList.remove('bi-star-fill');
            }
        });
    }
});
