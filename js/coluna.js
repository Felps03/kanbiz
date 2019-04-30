import $ from 'jquery';

import { ColunaController } from './controllers/ColunaController';
import { CartaoController } from './controllers/CartaoController';
import Kanban from './kanban/kanbiz';

const colunaController = new ColunaController(Kanban);
const cartaoController = new CartaoController(Kanban);

//const formCartao = document.querySelector('.formCartao');
//formCartao.addEventListener('submit', cartaoController.adicionaCartao.bind(cartaoController));

const formColunaModal = document.getElementById('criaColuna');
formColunaModal.addEventListener('submit', colunaController.adicionaColuna.bind(colunaController));

$(document).on("click", ".kanban-title-button", cartaoController.adicionaCartaoModal.bind(cartaoController));


const formCartaoModal = document.getElementById('criaCartao');
formCartaoModal.addEventListener('submit', cartaoController.adicionaCartao.bind(cartaoController));

/**
 * setTimeout(function(){
    $( "div.kanban-item" ).mouseover(function(){
        alert('coluna.js')
    }); 
}, 3000);
 */
// console.log($(".kanban-item"));