import $ from 'jquery';

import { db } from '../config/fb';

import { Controller } from "./Controller";
import { Projeto } from "../models/Projeto";
import { Colaborador } from '../models/Colaborador';
import { ProjetoView } from '../views/ProjetoView';

export class ProjetoController extends Controller {
    constructor() {
        super();
        this._inputNome = $('#InputNomeProjeto');
        this._timeView = new ProjetoView($('#timeViewProjeto'));
    }

    onUserLogged() {
        this._init();
    }

    _init() {
        this._timeView.render();
        $("#lds-spinner").show();
        db.child(`colaboradores/${this.user.id}/projeto`).on('value', snapshot => {
            if (snapshot.exists()) {
                $('#painelProjetoPrincipal').empty();
                snapshot.forEach(value => {
                    db.child(`projeto/${value.key}`).once('value', snapshotProjeto => {
                        if (snapshotProjeto.exists()) {
                            $("#lds-spinner").hide();
                            $('#painelProjetoPrincipal').append(this._timeView.painel(snapshotProjeto.val(), snapshotProjeto.key));
                        }
                    })
                });
            } else {
                $("#lds-spinner").hide();
            }
        });
    }

    adicionaProjeto(event) {
        event.preventDefault();
        let projeto = this._criaProjeto();
        db.child('projeto').push(projeto).then(snapshot => {
            db.child(`colaboradores/${this.user.id}/projeto`).update({
                [snapshot.key]: {
                    admin: true
                }
            })
        }).catch((error) => console.error("Erro ao criar Projeto ", error))
            .finally(() => $('#modalCriaProjeto').modal('hide'));
        this._limpaFormulario();
    }

    atualizaProjeto() {
        let idProjeto = this._recuperaChaveProjeto();
        db.child(`projeto/${idProjeto}`).on('value', snapshot => {
            $('#InputNomeProjetoEdita').val(snapshot.val()._nome);
            $('#InputUIDProjeto').val(snapshot.key);
            $('#modalEditaProjeto').modal('show');
        });
    }


    editarProjeto(event) {
        event.preventDefault();
        let nome = $("#InputNomeProjetoEdita").val();
        let chaveProjeto = $('#InputUIDProjeto').val();
        db.child(`projeto/${chaveProjeto}/`).update({
            _nome: nome
        })
        $('#modalEditaProjeto').modal('hide');
    }

    excluirProjeto(event) {
        event.preventDefault();
        let chaveProjeto = this._recuperaChaveProjeto();
        db.child(`projeto/${chaveProjeto}/_colaboradores`).on('child_added', snapshot => {
            if (snapshot.exists()) {
                db.child(`colaboradores/${snapshot.key}/projeto/`).child(chaveProjeto).remove().then(function () {
                    console.log('Excluido o projeto do Colaborador');
                }).then(function () {

                }).catch(function (error) {
                    console.error("Erro ao excluir colaboradores/Projeto ", error);
                });
            }
        })
        db.child(`projeto/${chaveProjeto}`).remove();
        $(location).attr('href', 'home.html');
    };


    _listaColaboradoresProjeto() {
        let chaveProjeto = this._recuperaChaveProjeto();
        db.child(`projeto/${chaveProjeto}/_colaboradores`).on('value', snapshot => {
            $('#membroProjeto').empty();
            if (snapshot.exists()) {
                let count = 1;
                snapshot.forEach(value => {
                    db.child(`usuario/${value.key}`).on('value', snapshotUsuario => {
                        $('#membroProjeto').append(this._timeView.membroProjeto(snapshotUsuario.val(), count++));

                    });
                    $('#listaColaboradoresModal').modal('show');
                });
            }
        });
    }

    _excluirColaboradoresProjeto() {
        // let uid = this._pesquisarColaboradorEmail('felipe@gmail.com');

        let uid = 'b6CS4TAejgfii54HzWMwhWPdYQB2';
        let chaveProjeto = '-LcmfXaBxbQPo2meP0mC';

        db.child('projeto').child(chaveProjeto).child('_colaborador').child(uid).remove().then(function () {
            console.log('Colaborador Deletado do Projeto');
        });

        db.child(`colaboradores/${uid}/projeto`).child(chaveProjeto).remove().then(function () {
            alert('Colaborador Deletado do Projeto');
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
        });

    }

    _criaProjeto() {
        let usuarioLogado = new Colaborador(this.user.id, true);
        let _admin = {
            bloqueado: false,
            finalizado: false,
            arquivado: false,
        }
        return new Projeto(
            this._inputNome.val(),
            usuarioLogado,
            _admin
        );
    }

    _recuperaChaveProjeto() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        return (url.searchParams.get("chave"));
    }

    _limpaFormulario() {
        this._inputNome.val("");
        this._inputNome.focus();
    }
}