// Vetor de imagens das cartas
let imagens = [];
for (let i = 1; i <= 8; i++){
    // imagens.push('https://picsum.photos/id/' + i + '/120'); 
    imagens.push(`https://picsum.photos/id/${i}/120`);
    // Veja que as duas linhas anteriores trazem o mesmo resultado, 
    // mas a segunda, que foi a escolhida, apresenta uma 
    // solução mais "elegante/atualizada" e por isso, foi escolhida.
}

// Toda vez que o site for recarregado, uma imagem diferente deverá ser
// carregada para o fundo das cartas.
// O Grayscale foi utilizado para não chamar muito a atenção para o 
// fundo das cartas ao invés de para o conteúdo.
let fundo = 'https://picsum.photos/120?grayscale';

// Estado do Jogo
let cartas = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    // Perceba que esse é um vetor de 8 pares.
    // Esses pares é que determinarão se as cartas formam ou não os pares esperados.
    // Esses valores serão atribuídos para as cartas, de modo que cada carta
    // corresponda a um número de par.  
let cliqueTravado = false;
let temCartaVirada = false;     // Se já tiver carta virada, impede que se vire outra carta.
let posicaoCartaVirada = -1;    // Qual a posição da carta? o valor -1 foi atribuído por não existir no vetor.
let valorCartaVirada = 0;       // será utilizado para saber se a carta virada é igual a próxima.
let pontos = 0;
const timerDoJogo = new Timer('#timer');

onload = () => {
    //Carrega as imagens de fundo
    let elementoImagens = document.querySelectorAll('#memoria img');
        // Perceba que foi utilizado o id=memória e o tag img.
        // Assim, apenas as imgs que estiverem dentro da div id=memoria serão capturadas.
    elementoImagens.forEach( (img, i) => {
        img.src = fundo;
        img.setAttribute('data-valor', i);
        img.style.opacity = 0.4;
    });
    //Cria o evento do botão de início
    document.querySelector('#btnInicio').onclick = iniciaJogo;
};

// Inicia o Jogo 
const iniciaJogo = () => {

    // Operação de embaralhamento das cartas / do vetor de pares
    for (let i = 0; i < cartas.length; i++){
        let p = Math.trunc(Math.random() * cartas.length);
            // Como o metódo Math.random está sendo multiplicado pelo tamanho
            // de cartas, ele retornará um valor entre 0 e 15.
        let aux = cartas[p];
        cartas[p] = cartas[i];
        cartas[i] = aux;
    }

    // Associar evento de clique às imagens
    let elementoImagens = document.querySelectorAll('#memoria img');
    elementoImagens.forEach( (img, i) => {
        img.onclick = trataCliqueImagem;
        img.style.opacity = 1;
        img.src = fundo;
    });

    // Reinicialização do Estado do Jogo
    cliqueTravado = false;
    temCartaVirada = false;
    posicaoCartaVirada = -1;
    valorCartaVirada = 0;
    pontos = 0;

    // Ajuste da interface
    document.querySelector('#btnInicio').disabled = true;
        // Impede que o usuário reinicie o jogo no meio da partida
    document.querySelector('#timer').style.backgroundColor = 'orange';
    timerDoJogo.start();
};

// Processa o clique na imagem
const trataCliqueImagem = (e) => {

    if (cliqueTravado) return;
        // Se a variável cliqueTravado for verdadeira,
        // o usuário não poderá fazer nada.
        // Não tem como clicar em nada.

    // A principal operação dessa função será a de mostrar a carta clicada.
    const p = +e.target.getAttribute('data-valor');
        // Essa constante está recebendo o valor que foi atribuído à cada carta(img) no HTML.
    const valor = cartas[p];
        // Lembrando que o vetor cartas contem os pares de valores que serão atribuídos às imagens.
        // cada par será atribuído a um valor, para que os 8 pares sejam distribuídos às 16 imagens.
    e.target.src = imagens[valor - 1];
        // O vetor catas vai de 1 a 8, enquanto as imagens vão de 0 a 7, por isso, (valor - 1)
    e.target.onclick = null;
        // Método necessário para impedir que o usuário continue clicando na mesma carta mais de uma vez.

    if (!temCartaVirada){
        temCartaVirada = true;
        posicaoCartaVirada = p;
        valorCartaVirada = valor;
    } else if( valor == valorCartaVirada) {
        pontos++;    
    } else {
        cliqueTravado = true;
        // Toda vez que o usuário abrir uma imagem, trava o clique.

        const p0 = posicaoCartaVirada;
            // Essa constante foi definida para não enviar 
            // para dentro de um setTimeout() uma variável
            // que mudará de valor durante o tempo de espera

        setTimeout( () => {
            e.target.src = fundo;
                //voltando a imagem de fundo se a imagem escolhida não foi igual ao seu par.
            e.target.onclick = trataCliqueImagem;
                // Habilitando o clique na imagem novamente.
            let img = document.querySelector('#memoria #i' + p0);
            img.src = fundo;
            img.onclick = trataCliqueImagem;
            cliqueTravado = false; // Liberação do clique.
        }, 2000);

        temCartaVirada = false;
        posicaoCartaVirada = -1;
        valorCartaVirada = 0;
    }
    
    // Quando o usuário fizer 8 pontos, 
    // o botão de inicio volta a funcionar.
    if(pontos == 8){
        document.querySelector('#btnInicio').disabled = false;
        document.querySelector('#timer').style.backgroundColor = 'lightgreen';
        timerDoJogo.stop();
    }
}

// Timer

function Timer(e){
    this.element = e;
    this.time = 0;
    this.control = null;

    this.start = () => {
        this.time = 0;
        this.control = setInterval( () => {
            this.time++;
            const minutes = Math.trunc(this.time/60);
            const seconds = this.time % 60;
            
            document.querySelector(this.element).innerHTML = 
                (minutes < 10 ? '0' : '') + minutes 
                + ':' +
                (seconds < 10 ? '0' : '') + seconds;
        }, 1000);
    };

    this.stop = () => {
        clearInterval(this.control);
        this.control = null;
    };
}