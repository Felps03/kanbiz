import {TimeController} from './controllers/TimeController.js';

const timeController = new TimeController();

// timeController._init();

const form = document.querySelector('form');

form.addEventListener('submit', timeController.adicionaTime.bind(timeController));
