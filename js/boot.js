import {currentInstance} from './controllers/TimeController';
import {} from './polyfill/fetch';

let timeController = currentInstance();

document.querySelector('.form').onsubmit = TimeController.adiciona.bind(timeController);
