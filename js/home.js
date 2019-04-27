import 'bootstrap';
import $ from 'jquery';

import { ProjetoController } from './controllers/ProjetoController';
import { TimeController } from './controllers/TimeController.js';
import { ColaboradorController } from './controllers/ColaboradorController';

const projetoController = new ProjetoController();
const timeController = new TimeController();
const colaboradorController = new ColaboradorController();

const form = document.getElementById('criaTime');
form.addEventListener('submit', timeController.adicionaTime.bind(timeController));

const formProjeto = document.getElementById('criaProjeto');
formProjeto.addEventListener('submit', projetoController.adicionaProjeto.bind(projetoController));

$(document).on("click", ".aceita", function () {
  timeController.aceitaColaboradorTime($("#InputIDTime").val(),true);
});

$(document).on("click", ".deleta", function () {
  timeController.recusarColaboradorTime($("#InputIDTime").val());
});



var tabela = document.querySelector('.list-group-flush');
tabela.addEventListener("click",function(event){
  event.target.parentNode.classList.add("fadeOut");
  if (event.target.parentNode.id == 'times-painel-lateral-nao-aceito') {
    $("#InputNomeTime").val(event.target.innerText);
    $("#InputNickTime").val(event.target.childNodes[3].innerText);
    $("#InputIDTime").val(event.target.id);
  }
});

