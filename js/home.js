import {TimeController} from './controllers/TimeController.js';
import {ColaboradoresController} from './controllers/ColaboradoresController';

const timeController = new TimeController();
const colaboradorController = new ColaboradoresController();

const form = document.querySelector('form');

form.addEventListener('submit', timeController.adicionaTime.bind(timeController));
