import $ from 'jquery';
import * as bootstrap from "bootstrap";

import { db } from '../config/fb';

import { Controller } from './Controller';
import { Coluna } from '../models/Coluna';

export class ColunaController extends Controller {
    constructor(kb) {
        super();
        this._kanban = kb;
        this._inputTitle = $('#InputTituloColuna');
        this._inputClass = $('#InputClasseColuna');
        this._inputLimitador = $('#InputLimitadorColuna');
    }

    onUserLogged() {
        this._init();
    }

    _init() {
        const that = this;
        db.child(`coluna`).on('value', snapshot => {
            snapshot.forEach(value => {
                this._kanban.removeBoard(value.key);
            });
            snapshot.forEach(value => {
                this._kanban.addBoards([{
                    "id": value.key,
                    "title": value.val().title,
                    "class": value.val().class,
                }]);
                db.child(`coluna/${value.key}/cartao`).on('child_added', snapshotCartao => {
                    db.child(`cartao/${snapshotCartao.key}`).on('value', cartaoSnapshot => {
                        this._kanban.removeElement(cartaoSnapshot.key);
                        let idCartao = 0;
                        this._kanban.addElement(value.key, {
                            "id": cartaoSnapshot.key,
                            "title": cartaoSnapshot.val().title,
                            "drop": function (el, event) {
                                that._atualizaColunaCartao(el.dataset.eid, event.parentNode.dataset.id);
                                if (idCartao != event.parentNode.dataset.id) {
                                    that._removeColunaCartao(el.dataset.eid, idCartao);
                                }
                            },
                            "drag": function (el, test) {
                                idCartao = test.parentNode.dataset.id;
                            },
                        });
                    })
                })
            });
            this._kanban.removeBoard("_criarCard");
            this._kanban.addBoards([{
                "id": "_criarCard",
                "title": "Criar Card",
                "item": [
                    {
                        "id": "testeid",
                        "title": "Clique Aqui!",
                        "click": function (el) {
                            $('#modalCriaColuna').modal('show');
                        },
                    }
                ]
            }]);
        });
    }

    _atualizaColunaCartao(chaveCartao, chaveColuna) {
        db.child(`coluna/${chaveColuna}/cartao`).update({
            [chaveCartao]: true
        }).then(function () {
            console.info("Atualiza Coluna ");
        }).catch(function (error) {
            console.error("Erro ao criar coluna ", error);
        });
    }

    _removeColunaCartao(chaveCartao, chaveColuna) {
        db.child(`coluna/${chaveColuna}/cartao/${chaveCartao}`).remove().then(function () {
            console.info("Remove Coluna ");
        }).catch(function (error) {
            console.error("Erro ao criar coluna ", error);
        });
    }

    atualizaColuna(event) {
        event.preventDefault();
        let coluna = this._criaColuna();
        let chaveColuna = $('#UID').val();
        let updates = {};
        updates[`/coluna/${chaveColuna}`] = coluna;
        db.update(updates);
        $(location).attr('href', 'home.html');
    }

    adicionaColuna(event) {
        event.preventDefault();
        let coluna = this._criaColuna();
        $('#modalCriaColuna').modal('hide');
        db.child('coluna').push(coluna).then(snapshot => {
            this.adicionaColunaProjeto(snapshot.key);
        }).catch(function (error) {
            console.error("Erro ao atualizar coluna ", error);
        });
        this._limpaFormulario();
    }

    adicionaColunaProjeto(chaveColuna) {
        let chaveProjeto = this._recuperaChaveProjeto();

        db.child(`projeto/${chaveProjeto}/coluna`).update({
            [chaveColuna]: true
        }).then(function () {
            console.info("Criou o Projeto Colaborador ");
        }).catch(function (error) {
            console.error("Erro ao criar projetoColaborador ", error);
        });
    }

    _recuperaChaveProjeto() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        return (url.searchParams.get("chave"));
    }

    _criaColuna() {
        return new Coluna(
            this._recuperaChaveProjeto(),
            this._inputTitle.val(),
            this._inputClass.val(),
            this._inputLimitador.val()
        );
    }

    _limpaFormulario() {
        this._inputTitle.val('');
        this._inputClass.val(' ');
        this._inputLimitador.val(' ');
        this._inputTitle.focus();
    }
}
