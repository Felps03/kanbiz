import $ from 'jquery';


import { ProjetoController } from './controllers/ProjetoController';

const projetoController = new ProjetoController();

const formProjeto = document.querySelector('.formProjeto');

formProjeto.addEventListener('submit', projetoController.adicionaProjeto.bind(projetoController));
