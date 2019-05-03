import $ from 'jquery';
import * as bootstrap from "bootstrap";

import { db } from '../config/fb';

import { Controller } from './Controller';
import { Coluna } from '../models/Coluna';
import { ColunaView } from '../views/ColunaView';

import { Cartao } from '../models/Cartao';

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

    // TODO: Verficar projeto vinculado
    _init() {
        const that = this;
        db.child(`coluna`).orderByChild(`_projeto`).equalTo(that._recuperaChaveProjeto()).on('value', snapshot => {
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
                    if (snapshotCartao.exists()) {
                        db.child(`cartao/${snapshotCartao.key}`).on('value', cartaoSnapshot => {
                            if (cartaoSnapshot.exists()) {
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
                                $(this).removeClass(cartaoSnapshot.val().corCartao);
                                if (cartaoSnapshot.val().corCartao) {
                                    $('.kanban-item').each(function (item) {
                                        if (cartaoSnapshot.key === (this).getAttribute('data-eid')) {
                                            $(this).addClass(cartaoSnapshot.val().corCartao);
                                        }
                                    });
                                }
                            }
                            this.mouseoverCartao();
                        });
                    }
                });
                this.mouseoverColuna();
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

    mouseoverColuna() {
        const that = this;

        $(".kanban-board-header").mouseover(function () {
            if ($("div.opcoesDaColuna").length == 0) {
                let idColuna = event.target.parentNode.dataset.id;
                $(this).append(ColunaView.opcoesDaColuna());
                $(".opcoesDaColuna-remove").click(function () {
                    that._removeColuna(idColuna);
                });
                $(".opcoesDaColuna-edita").click(function () {
                    that._editaColuna(idColuna);
                });
                $(".opcoesDaColuna-tipoPadrão").click(function () {
                    that.pintaColuna(idColuna, "warning");
                });
                $(".opcoesDaColuna-tipoTarefa").click(function () {
                    that.pintaColuna(idColuna, "info");
                });
                $(".opcoesDaColuna-tipoInspiração").click(function () {
                    that.pintaColuna(idColuna, "success");
                });
            }
        }).mouseleave(function () {
            $('div.opcoesDaColuna').remove();
        });
    }

    mouseoverCartao() {
        const that = this;
        $("div.kanban-item").mouseover(function () {
            let eidCartao = event.target.dataset.eid;
            let eidColuna_Atual = event.target.parentNode.parentNode.dataset.id;
            let title = event.target.innerText;

            $(this).addClass("bordaCartao");
            if ($("div.opcoesDoCartao").length == 0) {
                $(this).append(ColunaView.opcoesDoCartao());
                $(".opcoesDoCartao-remove").click(function () {
                    that._removeCartaoColuna(eidCartao, eidColuna_Atual)
                });
                $(".opcoesDoCartao-edita").click(function () {
                    $('#InputCartaoMove').empty();
                    db.child(`coluna`).orderByChild(`_projeto`).equalTo(that._recuperaChaveProjeto()).once('value', snapshot => {
                        if (snapshot.exists()) {
                            snapshot.forEach(value => {
                                $('#InputCartaoMove').append(`<option value="${value.key}">${value.val().title}</option>`);
                            });
                        }
                    });
                    $('#modalEditaCartao').modal('show');
                    $("#InputUIDEdita").val(eidCartao);
                    $("#InputCartaoNome").val(title);
                    $("#InputColunaAtual").val(eidColuna_Atual);
                });

                $(".opcoesDoCartao-tipoPadrão").click(function () {
                    that.pintaCartao(eidCartao, 'pintaPadrao');
                });
                $(".opcoesDoCartao-tipoImportante").click(function () {
                    that.pintaCartao(eidCartao, 'pintaImportante');
                });
                $(".opcoesDoCartao-tipoTarefa").click(function () {
                    that.pintaCartao(eidCartao, 'pintaTarefa');
                });
                $(".opcoesDoCartao-tipoInspiração").click(function () {
                    that.pintaCartao(eidCartao, 'pintaInspiracao');
                });
            }
        }).mouseleave(function () {
            $(this).removeClass("bordaCartao");
            $('.opcoesDoCartao').remove();
        });
    }

    pintaColuna(idColuna, cor) {
        db.child(`coluna/${idColuna}`).update({
            "class": cor
        });
    }

    /**
     * 
     * @param {*} idCartao 
     * @param {*} cor
     */
    pintaCartao(idCartao, cor) {
        db.child(`cartao/${idCartao}`).update({
            "corCartao": cor
        });
    }

    /**
     * 
     * @param {*} chaveCartao 
     * @param {*} chaveColuna 
     * Remover Cartao do projeto  ao mover
     */
    _atualizaColunaCartao(chaveCartao, chaveColuna) {
        db.child(`coluna/${chaveColuna}/cartao`).update({
            [chaveCartao]: true
        }).then(function () {
            console.info("Atualiza Coluna ");
        }).catch(function (error) {
            console.error("Erro ao criar coluna ", error);
        });
    }

    /**
     * 
     * @param {*} chaveCartao 
     * @param {*} chaveColuna 
     * Remover Cartao do projeto  ao mover
     */
    _removeColunaCartao(chaveCartao, chaveColuna) {
        const that = this;
        db.child(`coluna/${chaveColuna}/cartao/${chaveCartao}`).remove().then(function () {
            console.log('removendo...');
        }).catch(function (error) {
            console.error("Erro ao criar coluna ", error);
        });
    }

    /**
     * 
     * @param {*} chaveCartao 
     * @param {*} chaveColuna 
     * Remover cartao da coluna quando aperta excluir
     */
    _removeCartaoColuna(chaveCartao, chaveColuna) {
        const that = this;
        db.child(`coluna/${chaveColuna}/cartao/${chaveCartao}`).remove().then(function () {
            db.child(`cartao/${chaveCartao}`).remove().then(function () {
                that._kanban.removeElement(chaveCartao);
                console.log('removendo...');
            }).catch(function (error) {
                console.error("Erro ao remover cartao ", error);
            });
        }).catch(function (error) {
            console.error("Erro ao remover cartao da coluna ", error);
        });
    }

    atualizaColuna(event) {
        event.preventDefault();
        let id = $('#InputIDColuna').val();
        let coluna = {
            title: $('#InputTituloColunaEdita').val(),
            limit: $('#InputLimitadorColunaEdita').val(),
            class: $('#InputClasseColunaEdita').val(),
        };
        db.child(`coluna`).child($('#InputIDColuna').val()).update(coluna).catch(function (error) {
            console.error("Erro ao atualizar coluna ", error);
        }).finally(function () {
            $('#modalEditaColuna').modal('hide');
        });;
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


    // TODO: Mover para Cartao Controller;
    editaCartao(event) {
        event.preventDefault();
        let cartao = this._atualizaCartao();
        db.child(`/cartao/${cartao.uidCartao}`).update(cartao).then(snapshot => {
            db.child(`coluna/${cartao.uidBord}/cartao`).update({
                [cartao.uidCartao]: true
            })
        }).catch(function (error) {
            console.error("Erro ao atuaizar cartao ", error);
        }).finally(function () {
            $('#modalEditaCartao').modal('hide');
        });

        if (cartao.uidColunaAtual != cartao.uidBord) {
            db.child(`coluna/${cartao.uidColunaAtual}/cartao/${cartao.uidCartao}`).remove();
        }
        db.child(`cartao/${cartao.uidCartao}`).child('uidColunaAtual').remove();
    }

    _editaColuna(idColuna) {
        db.child(`coluna/${idColuna}`).once('value', snapshot => {
            $('#InputTituloColunaEdita').val(snapshot.val().title);
            $('#InputLimitadorColunaEdita').val(snapshot.val().limit);
            $('#InputClasseColunaEdita').val(snapshot.val().class);
            $('#InputIDColuna').val(idColuna);
            $('#modalEditaColuna').modal('show');
        }).catch(function (error) {
            console.error("Erro ao carregar dados do cartao ", error);
        });
    }

    _removeColuna(idColuna) {
        const that = this;
        db.child(`coluna/${idColuna}/cartao/`).once('value', snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(value => {
                    db.child(`cartao/${value.key}`).remove().then(function () {
                        that._kanban.removeElement(value.key);
                        console.info('removendo cartao ...');
                    }).catch(function (error) {
                        console.error("Erro ao remover cartao ", error);
                    });
                });
            }
        });
        db.child(`coluna/${idColuna}`).remove().then(function () {
            that._kanban.removeBoard(idColuna);
            console.log('removendo cartao ...');
        });
    }

    _atualizaCartao() {
        return new Cartao(
            $('#InputCartaoMove option:selected').val(),
            $('#InputCartaoNome').val(),
            $('#InputCartaoDescricao').val(),
            $('#InputCartaoDataEntrega').val(),
            $('#InputUIDEdita').val(),
            $('#InputColunaAtual').val()
        )
    }

    _recuperaChaveProjeto() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        return (url.searchParams.get("chave"));
    }
}
