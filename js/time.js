import $ from 'jquery';

import { TimeController } from './controllers/TimeController.js';
import { ColaboradorController } from './controllers/ColaboradorController';

const timeController = new TimeController();

const colaboradorController = new ColaboradorController();

timeController.buscaDetalheTime();

const form = document.querySelector('form');
form.addEventListener('submit', timeController.atualizaTime.bind(timeController));

const convidaMembro = document.querySelector('.convidaMembro');
convidaMembro.addEventListener('submit', timeController.procuraPorEmail.bind(timeController));


$("#verMembros").click( timeController.listaColaboradorTime.bind(timeController));