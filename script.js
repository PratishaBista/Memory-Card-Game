let clickSound = document.querySelector('#click-audio');
let buttonSound = document.querySelector('#button-audio');
const cardContainer = document.querySelector('.card-container');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset');
let timerInterval;
let flippedCards = [];
let matchedCards = [];

const createCard = image => {
    const card = document.createElement('div');
    card.classList.add('card');

    const frontFace = document.createElement('div');
    // createElement(tagName)
    frontFace.classList.add('card-face', 'front-face');

    const imgElement = document.createElement('img');
    imgElement.src = `Images/${image}`;
    frontFace.appendChild(imgElement);

    const backFace = document.createElement('div');
    backFace.classList.add('card-face', 'back-face');

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', flipCard);
    // addEventListener(type, listener)

    return card;
};

const flipCard = function () {
    clickSound.play()
    if (flippedCards.length < 2 && !flippedCards.includes(this) && !matchedCards.includes(this)) {
        this.classList.add('flipped');
        flippedCards.push(this);
        checkMatchingCards();
    }
};

const startTimer = () => {
    let startTime = Date.now();

    const updateTimer = () => {
        let elapsedTime = Date.now() - startTime;
        let seconds = Math.floor((elapsedTime / 1000) % 60);
        let minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
        let hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24);

        let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = formattedTime;
    };

    timerInterval = setInterval(updateTimer, 1000);

    cardContainer.removeEventListener('click', startTimer);
};

const checkMatchingCards = () => {
    if (flippedCards.length === 2) {
        const [firstCard, secondCard] = flippedCards;
        const firstValue = firstCard.querySelector('.front-face img').src;
        const secondValue = secondCard.querySelector('.front-face img').src;

        if (firstValue === secondValue) {
            flippedCards.forEach(card => matchedCards.push(card));

            flippedCards = [];
            if (matchedCards.length === cardContainer.children.length) {
                //returns the child elements of the cardConatiner 
                setTimeout(() => endGame(), 1000);
            }
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                });
                flippedCards = [];
            }, 1000);
        }
    }
};

const endGame = () => {
    clearInterval(timerInterval);
    const elapsedTime = timerDisplay.textContent;
    const formattedTime = formatTime(elapsedTime);
    alert(`Congratulations, you finished the game in ${formattedTime}`);
};

const formatTime = time => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
        formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    if (seconds > 0) {
        formattedTime += `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
    return formattedTime.trim();
};

const resetGame = () => {
    buttonSound.play()
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00:00';
    cardContainer.innerHTML = '';
    initGame();
};

const initGame = () => {
    const images = ['ace-diamond.jpg', 'ace-heart.jpg', 'jack-club.jpg', 'queen-club.jpg', 'seven-spade.jpg', 'two-spade.png', 'five-spade.jpg', 'ten-club.jpg'];
    shuffle(images);

    const pair = images.concat(images);
    shuffle(pair);

    pair.forEach(image => {
        const card = createCard(image);
        cardContainer.appendChild(card);
    });

    cardContainer.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetGame);
};

const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

initGame();

