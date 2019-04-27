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

const formProjeto = document.querySelector('.formProjeto');
formProjeto.addEventListener('submit', projetoController.adicionaProjeto.bind(projetoController));

$(document).on("click", ".aceita", function () {
  // let chaveTime = $("table tr:nth-child(2)").attr('id');
  timeController.aceitaColaboradorTime(true);
});

$(document).on("click", ".deleta", function () {
  timeController.recusarColaboradorTime();
});


// //TODO: Rever
// $('#orderModal').modal({
//   keyboarnd: true,
//   backdrop: "static",
//   show: false,
// }).on('show.bs.modal', function () {
//   var getIdFromRow = $(this).data('orderid');
//   var id = $(this).data('id');
//   alert(id);
//   $(this).find('#orderDetails').html($('<b> O ID eh: ' + getIdFromRow + '</b>'))
// });

// $(".table-striped").find('tr[data-target]').on('click', function () {
//   $('#orderModal').data('orderid', $(this).data('id'));
// });