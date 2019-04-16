import $ from 'jquery';

import { ColunaController } from './controllers/ColunaController';

const colunaController = new ColunaController();

const formColuna = document.querySelector('.formColuna');
formColuna.addEventListener('submit', colunaController.adicionaColuna.bind(colunaController));