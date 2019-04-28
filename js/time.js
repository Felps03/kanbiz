import { TimeController } from './controllers/TimeController.js';

const timeController = new TimeController();

timeController.buscaDetalheTime();

const form = document.querySelector('form');
form.addEventListener('submit', timeController.atualizaTime.bind(timeController));


const convidaMembro = document.querySelector('.convidaMembro');
convidaMembro.addEventListener('submit', timeController.procuraPorEmail.bind(timeController));
