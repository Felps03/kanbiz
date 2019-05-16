import $ from 'jquery';
import * as bootstrap from "bootstrap";

import { db } from '../config/fb';

import { Controller } from './Controller';
import { Coluna } from '../models/Coluna';
import { ColunaView } from '../views/ColunaView';
import { MensagemView } from '../views/MensagemView';

import { Cartao } from '../models/Cartao';

export class ColunaController extends Controller {
    constructor(kb) {
        super();
        this._kanban = kb;
        this._inputTitle = $('#InputTituloColuna');
        this._inputClass = $('#InputClasseColuna');
        this._inputLimitador = $('#InputLimitadorColuna');
        this._mensagemView = new MensagemView('#mensagemView');
    }

    onUserLogged() {
        this._init();
        this.verficiaConfiguracaoProjeto();
    }

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
                that.numeroColuna(value.key, value.val().limit);
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
                                    }
                                });
                                $(this).removeClass(cartaoSnapshot.val().corCartao);
                                that.configuracaoCartao(cartaoSnapshot);
                            }
                            this.mouseoverCartao();
                        });
                    }
                });
                this.mouseoverColuna();
                this.verficiaConfiguracaoProjeto();
            });
        });
    }

    numeroColuna(boardID, limit) {
        const that = this;
        $('.kanban-board').each(function (item) {  
            if (boardID === (this).getAttribute('data-id')) {
                let count = 0;
                db.child(`coluna/${boardID}/cartao`).once('value', snapshot => {
                    if(snapshot.exists()) {
                        snapshot.forEach(value => {
                            count++;
                        })
                    }
                }).then(() => {
                    $(this).append(ColunaView.limitadorBoard(count ,limit));
                    if(count > limit) {
                        that.pintaColuna(boardID, "pintaImportante");
                    }
                    count = 0;
                })                
            }
        })
    }

    configuracaoCartao(cartaoSnapshot) {
        if (cartaoSnapshot.val().corCartao) {
            $('.kanban-item').each(function (item) {
                if (cartaoSnapshot.key === (this).getAttribute('data-eid')) {
                    $(this).addClass(cartaoSnapshot.val().corCartao);
                }
            });
        };
        if (cartaoSnapshot.val().dataEntrega) {
            $('.kanban-item').each(function (item) {
                if (cartaoSnapshot.key === (this).getAttribute('data-eid')) {
                    $(this).append(ColunaView.dataEntrega(cartaoSnapshot.val().dataEntrega));
                }
            })
        }
        if (cartaoSnapshot.val().colaborador) {
            db.child(`usuario/${cartaoSnapshot.val().colaborador}`).once('value', snapshotUsuario => {
                if (snapshotUsuario.exists()) {
                    let nome = snapshotUsuario.val().nome ? snapshotUsuario.val().nome : snapshotUsuario.val().email;
                    let fotoUrl = snapshotUsuario.val().fotoUrl ? snapshotUsuario.val().fotoUrl : "https://raw.githubusercontent.com/Felps03/kanbiz/master/images/placeholder.jpeg";
                    if (cartaoSnapshot.val().colaborador) {
                        $('.kanban-item').each(function (item) {
                            if (cartaoSnapshot.key === (this).getAttribute('data-eid')) {
                                if ($(this).find('div.fotoColaborador').length == 0) {
                                    $(this).append(ColunaView.fotoColaboradorCartao(nome, fotoUrl));
                                }
                            }
                        })
                    }
                }
            });
        }
    }


    bloqueadoProjeto(verifica) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).update({
            "bloqueado": verifica
        });
        this.verficiaConfiguracaoProjeto();
    }

    finalizaProjeto(verifica) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).update({
            "finalizado": verifica
        });
    }

    arquivaProjeto(verifica) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).update({
            "arquivado": verifica
        });
    }

    _verificaAdmin() {
        return new Promise((resolve, reject) => {
            db.child(`colaboradores/${this.user.id}/projeto/${this._recuperaChaveProjeto()}`).once('value', snapshot => {
                if (snapshot.exists()) {
                    $(".adminProjeto").show();
                    resolve(true);
                } else {
                    $(".adminProjeto").hide();
                    resolve(false);
                }
            }).catch(erro => {
                reject('Não Foi possivel obter informacao ', erro);
            });
        });
    }

    verficiaConfiguracaoProjeto() {
        this._verificaAdmin().then(admin => {

            db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).on('value', snapshot => {
                if (snapshot.exists()) {
                    $("#mensagemView").empty();
                    if (admin) {
                        $("#adminSnap").show();
                        if (snapshot.val().bloqueado) {
                            $("#mensagemView").append(this._mensagemView.template(`Projeto está Bloqueado!`));
                            $("#desbloquear").show();
                            $("#bloquear").hide();
                        } else {
                            $("#bloquear").show();
                            $("#desbloquear").hide();
                        }
                        if (snapshot.val().finalizado) {
                            $("#mensagemView").append(this._mensagemView.template('Projeto está Finalizado!'));
                            $("#finalizar").hide();
                            $("#desfinalizar").show();
                        } else {
                            $("#finalizar").show();
                            $("#desfinalizar").hide();
                        }
                        if (snapshot.val().arquivado) {
                            $("#mensagemView").append(this._mensagemView.template('Projeto está Arquivado!'));
                            $("#arquivar").hide();
                            $("#desarquivar").show();
                        } else {
                            $("#desarquivar").hide();
                            $("#arquivar").show();
                        }

                        if (snapshot.val().bloqueado || snapshot.val().finalizado || snapshot.val().arquivado) {
                            $("#addBoard").hide();
                            $("#updateQuadro").hide();
                            $("#addColaborador").hide();
                        } else {
                            $("#addBoard").show();
                            $("#updateQuadro").show();
                            $("#addColaborador").show();
                        }
                    } else {
                        if (snapshot.val().arquivado) {
                            alert('Projeto Arquivado');
                            $(location).attr('href', 'home.html');
                        }
                        if (snapshot.val().bloqueado) {
                            $("#mensagemView").append(this._mensagemView.template(`Projeto está Bloqueado!`));
                            $('button').attr('disabled', 'disabled');
                            $("#addBoard").hide();
                            $("#addColaborador").hide();
                        } else {
                            $("#addBoard").show();
                            $("#addColaborador").show();
                        }
                        if (snapshot.val().finalizado) {
                            alert('Projeto finalizado');
                            $(location).attr('href', 'home.html');
                        }
                        $("#bloquear").hide();
                        $("#desbloquear").hide();
                        $("#finalizar").hide();
                        $("#desfinalizar").hide();
                        $("#desarquivar").hide();
                        $("#arquivar").hide();
                        $("#updateQuadro").hide();
                        $("#adminSnap").hide();
                    }
                }
            });
        })

    }

    mouseoverColuna() {
        const that = this;
        $(".kanban-board-header").mouseover(function () {
            if ($("div.opcoesDaColuna").length == 0) {
                let idColuna = event.target.parentNode.dataset.id;
                $(this).append(ColunaView.opcoesDaColuna());
                $(".opcoesDaColuna-remove").click(() => that._removeColuna(idColuna));
                $(".opcoesDaColuna-edita").click(() => that._editaColuna(idColuna));
                $(".opcoesDaColuna-tipoPadrão").click(() => that.pintaColuna(idColuna, "warning"));
                $(".opcoesDaColuna-tipoTarefa").click(() => that.pintaColuna(idColuna, "info"));
                $(".opcoesDaColuna-tipoInspiração").click(() => that.pintaColuna(idColuna, "success"));
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
                    $('#InputCartaoColaborador').empty();
                    db.child(`projeto/${that._recuperaChaveProjeto()}/_colaboradores`).once('value', snapshot => {
                        snapshot.forEach(value => {
                            db.child(`usuario/${value.key}`).once('value', snapshotUsuario => {
                                if (snapshotUsuario.exists()) {
                                    let nome = snapshotUsuario.val().nome ? snapshotUsuario.val().nome + " |" : "";
                                    let select = nome + ' ' + snapshotUsuario.val().email;
                                    $('#InputCartaoColaborador').append(`<option value="${snapshotUsuario.key}">${select}</option>`);
                                }
                            });
                        });
                        $('#InputCartaoColaborador').append(`<option value=""> </option>`);
                    });
                    db.child(`cartao/${eidCartao}`).once('value', snapshot => {
                        $("#InputUIDEdita").val(snapshot.key);
                        $("#InputCartaoNome").val(snapshot.val().title);
                        $("#InputColunaAtual").val(snapshot.val().uidBord);
                        $("#InputCartaoDescricao").val(snapshot.val().descricao);
                        $("#InputCartaoColaborador").val(snapshot.val().colaborador);
                        $('#modalEditaCartao').modal('show');
                    })
                });

                $(".opcoesDoCartao-tipoPadrão").click(() => that.pintaCartao(eidCartao, 'pintaPadrao'));
                $(".opcoesDoCartao-tipoImportante").click(() => that.pintaCartao(eidCartao, 'pintaImportante'));
                $(".opcoesDoCartao-tipoTarefa").click(() => that.pintaCartao(eidCartao, 'pintaTarefa'));
                $(".opcoesDoCartao-tipoInspiração").click(() => that.pintaCartao(eidCartao, 'pintaInspiracao'));
            }
        }).mouseleave(function () {
            $(this).removeClass("bordaCartao");
            $('.opcoesDoCartao').remove();
        });
    }

    pintaColuna(idColuna, cor) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {
                db.child(`coluna/${idColuna}`).update({
                    "class": cor
                });
            }
        });
    }

    /**
     * 
     * @param {*} idCartao 
     * @param {*} cor
     */
    pintaCartao(idCartao, cor) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {
                db.child(`cartao/${idCartao}`).update({
                    "corCartao": cor
                });
            }
        });
    }

    /**
     * 
     * @param {*} chaveCartao 
     * @param {*} chaveColuna 
     * Remover Cartao do projeto  ao mover
     */
    _atualizaColunaCartao(chaveCartao, chaveColuna) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {
                db.child(`coluna/${chaveColuna}/cartao`).update({
                    [chaveCartao]: true
                }).then(() => {
                    db.child(`cartao/${chaveCartao}`).update({
                        uidBord: chaveColuna
                    })
                }).catch(error => console.error("Erro ao criar coluna ", error));
            }
        })
    }

    /**
     * 
     * @param {*} chaveCartao 
     * @param {*} chaveColuna 
     * Remover Cartao do projeto  ao mover
     */
    _removeColunaCartao(chaveCartao, chaveColuna) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {
                db.child(`coluna/${chaveColuna}/cartao/${chaveCartao}`).remove().catch(function (error) {
                    console.error("Erro ao criar coluna ", error);
                });
            }
        })
    }

    /**
     * 
     * @param {*} chaveCartao 
     * @param {*} chaveColuna 
     * Remover cartao da coluna quando aperta excluir
     */
    _removeCartaoColuna(chaveCartao, chaveColuna) {
        const that = this;
        db.child(`coluna/${chaveColuna}/cartao/${chaveCartao}`).remove()
            .then(() => db.child(`cartao/${chaveCartao}`).remove()
                .then(() => that._kanban.removeElement(chaveCartao)))
            .catch(error => console.error("Erro ao remover cartao da coluna ", error));
    }

    atualizaColuna(event) {
        event.preventDefault();
        let id = $('#InputIDColuna').val();
        let coluna = {
            title: $('#InputTituloColunaEdita').val(),
            limit: $('#InputLimitadorColunaEdita').val(),
            class: $('#InputClasseColunaEdita').val(),
        };
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {
                db.child(`coluna`).child($('#InputIDColuna').val()).update(coluna).catch(function (error) {
                    console.error("Erro ao atualizar coluna ", error);
                }).finally(() => $('#modalEditaColuna').modal('hide'));
            }
        })
    }

    adicionaColuna(event) {
        event.preventDefault();
        let coluna = this._criaColuna();
        $('#modalCriaColuna').modal('hide');
        db.child('coluna').push(coluna)
            .then(snapshot => this.adicionaColunaProjeto(snapshot.key))
            .catch(error => console.error("Erro ao atualizar coluna ", error));

        this._limpaFormulario();
    }

    adicionaColunaProjeto(chaveColuna) {
        db.child(`projeto/${this._recuperaChaveProjeto()}/coluna`).update({
            [chaveColuna]: true
        }).catch(error => console.error("Erro ao criar projetoColaborador ", error));
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
        this._inputLimitador.val(' ');
        this._inputTitle.focus();
    }

    // TODO: Mover para Cartao Controller;
    editaCartao(event) {
        event.preventDefault();

        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {

                let cartao = this._atualizaCartao();
                db.child(`/cartao/${cartao.uidCartao}`).update(cartao).then(() => {
                    db.child(`coluna/${cartao.uidBord}/cartao`).update({
                        [cartao.uidCartao]: true
                    })
                })
                    .catch(error => console.error("Erro ao atuaizar cartao ", error))
                    .finally(() => $('#modalEditaCartao').modal('hide'));

                if (cartao.uidColunaAtual != cartao.uidBord) {
                    db.child(`coluna/${cartao.uidColunaAtual}/cartao/${cartao.uidCartao}`).remove();
                }
                db.child(`cartao/${cartao.uidCartao}`).child('uidColunaAtual').remove();
            }
        });
    }

    _editaColuna(idColuna) {
        db.child(`coluna/${idColuna}`).once('value', snapshot => {
            if (snapshot.exists()) {
                $('#InputTituloColunaEdita').val(snapshot.val().title);
                $('#InputLimitadorColunaEdita').val(snapshot.val().limit);
                $('#InputClasseColunaEdita').val(snapshot.val().class);
                $('#InputIDColuna').val(idColuna);
                $('#modalEditaColuna').modal('show');
            }
        }).catch(function (error) {
            console.error("Erro ao carregar dados do cartao ", error);
        });
    }

    _removeColuna(idColuna) {
        const that = this;
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {
                db.child(`coluna/${idColuna}/cartao/`).once('value', snapshot => {
                    if (snapshot.exists()) {
                        snapshot.forEach(value => {
                            db.child(`cartao/${value.key}`).remove().then(() => {
                                that._kanban.removeElement(value.key);
                                console.info('removendo cartao ...');
                            }).catch(error => console.error("Erro ao remover cartao ", error));
                        });
                    }
                }).then(() => db.child(`coluna/${idColuna}`).remove().then(() => that._kanban.removeBoard(idColuna)));
            }
        });
    }

    _pesquisarColaboradorEmail(event) {
        event.preventDefault();
        $("#mensagemView").empty();
        let email = $("#InputEmailColaborador").val()
        db.child(`usuario`).orderByChild('email').equalTo(email).on('child_added', snapshot => {
            if (snapshot.exists()) {
                this.convidaMembro(snapshot.val().uid);
            } else {
                $("#mensagemView").append(this._mensagemView.template(`Não foi possivel encontrar colaborador`));
            }
        });
    }

    convidaMembro(id) {
        let chaveProjeto = this._recuperaChaveProjeto();
        db.child('projeto').child(chaveProjeto).child('_colaboradores').update({
            [id]: true
        }).then(function () {

        });
        $("#mensagemView").empty();
        db.child(`colaboradores/${id}/projeto`).update({
            [chaveProjeto]: true
        }).then(function () {
            $("#mensagemView").append(this._mensagemView.template(`Colaborador Convidado!`));
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
            $(location).attr('href', 'home.html');
        });
        $('#modalConvidaMembro').modal('hide');
    }

    _atualizaCartao() {
        return new Cartao(
            $('#InputCartaoMove option:selected').val(),
            $('#InputCartaoNome').val(),
            $('#InputCartaoDescricao').val(),
            $('#InputCartaoDataEntrega').val(),
            $('#InputUIDEdita').val(),
            $('#InputColunaAtual').val(),
            $('#InputCartaoColaborador option:selected').val(),
        )
    }

    _recuperaChaveProjeto() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        return (url.searchParams.get("chave"));
    }
}
