import $ from 'jquery';
import * as bootstrap from "bootstrap";

import { db } from '../config/fb';

import { Controller } from './Controller';
import { Coluna } from '../models/Coluna';
import { ColunaView } from '../views/ColunaView';

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
        db.child(`coluna`).on('value', snapshot => {
            if (snapshot.exists()) {
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
                                }
                                this.mouseoverCartao();
                            });
                        }
                    });
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
            }
        });
    }

    mouseoverCartao() {
        const that = this;
        $("div.kanban-item").mouseover(function () {
            let dataOrder = event.target.parentNode.parentNode.dataset.order;
            let eidCartao = event.target.dataset.eid;
            let eidColuna_Atual = event.target.parentNode.parentNode.dataset.id;
            let nomeColuna_Atual = event.target.parentNode.parentNode.firstChild.innerText;
            let title = event.target.innerText;
            let colunaDoLado = event.target.parentNode.parentNode.parentNode.childNodes;
            $(this).addClass("bordaCartao");
            if ($("div.opcoesDoCartao").length == 0) {
                $(this).append(ColunaView.opcoesDoCartao());
                $(".opcoesDoCartao-remove").click(function () {
                    that._removeCartaoColuna(eidCartao, eidColuna_Atual)
                });
                $(".opcoesDoCartao-edita").click(function () {
                    let idColuna_Lado;
                    let nomeColuna_Lado;
                    let existeProximo = false;
                    if (colunaDoLado[dataOrder].dataset.id !== '_criarCard') {
                        nomeColuna_Lado = colunaDoLado[dataOrder].childNodes[0].firstChild.innerHTML;
                        idColuna_Lado = colunaDoLado[dataOrder].dataset.id;
                        existeProximo = true;
                    } else {
                        existeProximo = false;
                    }
                    $('#modalEditaCartao').modal('show');
                    $("#InputUIDEdita").val(eidCartao);
                    $("#InputCartaoNome").val(title);

                    let ColunaNomeAtual = nomeColuna_Atual.split("+");
                    let selectValues;
                    if (existeProximo) {
                        selectValues = { eidColuna_Atual: ColunaNomeAtual[0], idColuna_Lado: nomeColuna_Lado };
                    } else {
                        selectValues = { eidColuna_Atual: ColunaNomeAtual[0] };
                    }
                    $('#InputCartaoMove').empty();
                    $.each(selectValues, function (key, value) {
                        $('#InputCartaoMove')
                            .append($("<option></option>")
                                .attr("value", key)
                                .text(value));
                    });
                });
            }
        }).mouseleave(function () {
            $(this).removeClass("bordaCartao");
            $('.opcoesDoCartao').remove();
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
            });
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
