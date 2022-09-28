onload = () => {
    // Botões numéricos
    document.querySelector('#btn-0').onclick = () => digito(0);
    document.querySelector('#btn-1').onclick = () => digito(1);
    document.querySelector('#btn-2').onclick = () => digito(2);
    document.querySelector('#btn-3').onclick = () => digito(3);
    document.querySelector('#btn-4').onclick = () => digito(4);
    document.querySelector('#btn-5').onclick = () => digito(5);
    document.querySelector('#btn-6').onclick = () => digito(6);
    document.querySelector('#btn-7').onclick = () => digito(7);
    document.querySelector('#btn-8').onclick = () => digito(8);
    document.querySelector('#btn-9').onclick = () => digito(9);
    
    // Botões das operações
    document.querySelector('#btn-comma').onclick = virgula;
    document.querySelector('#btn-ac').onclick = ac;
    document.querySelector('#btn-plus').onclick = () => operator('+');
    document.querySelector('#btn-minus').onclick = () => operator('-');
    document.querySelector('#btn-times').onclick = () => operator('*');
    document.querySelector('#btn-divide').onclick = () => operator('/');
    document.querySelector('#btn-equals').onclick = calcula;
}

// Variáveis para armazenamento o valor, o operador e o estado da calculadora.
let sValor = '0';        // Valor que será apresentado no display
let ehNovoNumero = true; // Indica se o próximo dígito será de um novo valor
let valorAnterior = 0;   // Valor acumulado para uma operação
let operacaoPendente = null; // Operação acumulada

// Função para atualizar os valores do display
const atualizaVisor = () => {
    let [parteInteira, parteDecimal] = sValor.split(',');
        // O conceito utilizado aqui é o de atribuição via desestruturação.
    let v = '';
    c = 0;

    for(let i = parteInteira.length - 1; i >= 0; i--){
        //Esse if será o responsável pelas casas de milhares.
        if( ++c > 3){
            v = '.' + v;
            c = 1;
        }
        v = parteInteira[i] + v;
            // Aqui, não podemos usar o operador += porque isso inverteria a ordem dos números.
            // Para resolver isso, precisamos deixar o 'v' para ser somado depois de já adicionado o ponto.
    }

    v = v + (parteDecimal ? ',' + parteDecimal.substr(0, 10 - v.length) : '');
    document.querySelector('#display').innerText = v;
        // Perceba que a string sValor passou a ser uma variável interna e a que será exibica será a string 'v'.

    // Essa condição limita o valor inteiro do número a 12 caracteres.
    // Se o usuário tentar digitar um valor maior, um erro será exibido.-
    if (parteInteira.length > 12){
        document.querySelector('#display').innerText = 'Erro!'
    }
}

// Função de tratamento do clique no dígito
const digito = (n) => {
    if(ehNovoNumero){
        sValor = '' + n;
        ehNovoNumero = false;
    } else sValor += n;
    atualizaVisor();
}

// Tratamento do clique no botão de ponto decimal
const virgula = () => {
    if (ehNovoNumero) {
        sValor = '0,';
        ehNovoNumero = false;
    } else if(sValor.indexOf(',') == -1) sValor += ',';
    atualizaVisor();
}

// Tratamento do clique no botão AC (All Clear)
const ac = () => {
    sValor = '0';
    acabaComTudo();
}

// Converte a string do valor para um número real
const valorAtual = () => parseFloat(sValor.replace(',','.'));

// Tratamento do clique nos botões de operação
const operator = (op) => {
    calcula();
    valorAnterior = valorAtual();
    operacaoPendente = op;
    ehNovoNumero = true;
}

const calcula = () => {
    let resultado;
    if (operacaoPendente != null){
        switch(operacaoPendente){
            case '+':
                resultado = valorAnterior + valorAtual();
                break
            case '-':
                resultado = valorAnterior - valorAtual();
                break
            case '*':
                resultado = valorAnterior * valorAtual();
                break
            case '/':
                resultado = valorAnterior / valorAtual();
                break
        }
        sValor = resultado.toString().replace('.', ',');
    }
    acabaComTudo();
}

const acabaComTudo = () => {
    ehNovoNumero = true;        // Indica se o próximo dígito será de um novo valor
    operacaoPendente = null;    // Operação acumulada
    valorAnterior = 0;          // Valor acumulado para uma operação
    atualizaVisor();            // Atualiza os valores do display
}