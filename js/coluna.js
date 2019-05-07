import $ from 'jquery';

import { ColunaController } from './controllers/ColunaController';
import { CartaoController } from './controllers/CartaoController';
import Kanban from './kanban/kanbiz';

const colunaController = new ColunaController(Kanban);
const cartaoController = new CartaoController(Kanban);

const formColunaModal = document.getElementById('criaColuna');
formColunaModal.addEventListener('submit', colunaController.adicionaColuna.bind(colunaController));

$(document).on("click", ".kanban-title-button", cartaoController.adicionaCartaoModal.bind(cartaoController));

const formCartaoModal = document.getElementById('criaCartao');
formCartaoModal.addEventListener('submit', cartaoController.adicionaCartao.bind(cartaoController));

const formEditaCartao = document.getElementById('modalEditaCartao');
formEditaCartao.addEventListener('submit', colunaController.editaCartao.bind(colunaController));

const formColunaModalEdita = document.getElementById('modalEditaColuna');
formColunaModalEdita.addEventListener('submit', colunaController.atualizaColuna.bind(colunaController));

const bloquearProjeto = document.getElementById('bloquear');
bloquearProjeto.addEventListener('click', colunaController.bloqueadoProjeto.bind(colunaController, true));

const desbloquearProjeto = document.getElementById('desbloquear');
desbloquearProjeto.addEventListener('click', colunaController.bloqueadoProjeto.bind(colunaController, false));

const finalizarProjeto = document.getElementById('finalizar');
finalizarProjeto.addEventListener('click', colunaController.finalizaProjeto.bind(colunaController, true));

const arquivarProjeto = document.getElementById('arquivar');
arquivarProjeto.addEventListener('click', colunaController.arquivaProjeto.bind(colunaController, true));