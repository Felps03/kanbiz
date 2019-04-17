import $ from 'jquery';

import { ColunaController } from './controllers/ColunaController';
import { CartaoController } from './controllers/CartaoController';
import Kanban from './kanban/kanbiz';

const colunaController = new ColunaController(Kanban);
const cartaoController = new CartaoController();


const formColuna = document.querySelector('.formColuna');
formColuna.addEventListener('submit', colunaController.adicionaColuna.bind(colunaController));


const formCartao = document.querySelector('.formCartao');
formCartao.addEventListener('submit', cartaoController.adicionaCartao.bind(cartaoController));
