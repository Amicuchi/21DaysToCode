// Renderização do HTML
// --------------------

const cardBoard = document.querySelector('#cardboard');

const images = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/240px-Angular_full_color_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png',
    'https://raw.githubusercontent.com/detain/svg-logos/master/svg/backbone-icon.svg',
    'https://cdn.worldvectorlogo.com/logos/ember-tomster.svg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/555px-Vue.js_Logo_2.svg.png',
    'https://cdn.worldvectorlogo.com/logos/aurelia-1.svg'
];
const fundo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Javascript_badge.svg/1200px-Javascript_badge.svg.png';

// Inserção das DIVs de Imagens no HTML
let cardHTML = '';
images.forEach(img => {
    cardHTML += `
    <div class="memory-card" data-card="${img}">
        <img class="front-face" src="${img}" />
        <img class="back-face" src="${fundo}" />
    </div>
    `
});

//Inserção das imagens no tabuleiro
cardBoard.innerHTML = cardHTML + cardHTML;


// Movimento de Virada da carta
// ----------------------------
const cards = document.querySelectorAll('.memory-card');
    // O JS pega todas as tags com a classe memory-card.
let firstCard;
let secondCard;
let lockCard = false;

function flipCard() {
    if (lockCard) return false;

    this.classList.add('flip')
    
    if(!firstCard){
        firstCard = this;
        return false;   //Para fazer a atribuição e sair da função.
    }
    secondCard = this;

    checkForMatch();
}

cards.forEach( card => card.addEventListener('click',flipCard));

//Função que verifica 
function checkForMatch(){
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    !isMatch ? disableCards() : resetCard(isMatch);
}

// Função que tira o flip da carta para desvirar ela
function disableCards(){
    lockCard = true;

    setTimeout( () => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetCard()
    }, 1500);   
}

function resetCard(isMatch = false) {
    if (isMatch){
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
    }
    [firstCard, secondCard, lockCard] = [null, null, false]
    // Maneira de atribuir vários valores para várias variáveis de uma vez.
}

// Função para embaralhar as cartas
// Foi declarada com uma notação diferente para que ela já chame a si mesmo
// sem precisar ser chamada.
(function shuffle() {
    cards.forEach( card => {
        let rand = Math.floor(Math.random() * 12);
        card.style.order = rand;
    })
})();