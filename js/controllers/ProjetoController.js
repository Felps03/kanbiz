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
            $('#table-body-Projeto').empty();
            snapshot.forEach(value => {
                if (value.val()) {
                    db.child(`projeto/${value.key}`).on('value', snapshotProjeto => {
                        $("#lds-spinner").hide();
                        $('#table-body-Projeto').append(this._timeView.linha(snapshotProjeto.val(), snapshotProjeto.key));
                    })
                }
            });
        });
        this._listaColaboradoresProjeto();
    }

    adicionaProjeto(event) {
        event.preventDefault();
        let projeto = this._criaProjeto();
        db.child('projeto').push(projeto).then(snapshot => {
            this._adicionaProjetoColaborador(this.user.id, snapshot.key);
        }).catch(function (error) {
            console.error("Erro ao criar projeto ", error);
        });
        this._limpaFormulario()
    }

    _adicionaProjetoColaborador(chaveUsuario, chaveProjeto, admin = false) {
        db.child(`colaboradores/${chaveUsuario}/projeto`).update({
            [chaveProjeto]: true
        }).then(function () {
            console.info("Criou o Projeto Colaborador ");
        }).catch(function (error) {
            console.error("Erro ao criar projetoColaborador ", error);
        });
    }

    editarProjeto() {

    }

    arquivarProjeto() {

    }

    bloquearProjeto() {

    }

    _listaColaboradoresProjeto() {
        let chaveProjeto = '-LcmfXaBxbQPo2meP0mC';
        db.child(`projeto/${chaveProjeto}/_colaborador`).on('value', snapshot => {
            console.log('_listaColaboradoresProjeto: ', snapshot.val());
            console.log('_listaColaboradoresProjeto - snapshot.exists(): ', snapshot.exists());
            if (snapshot.exists()) {
                snapshot.forEach(value => {
                    db.child(`usuario/${value.key}`).on('value', snapshotUsuario => {
                        console.log('_listaColaboradoresProjeto ', snapshotUsuario.val());
                    });
                });
            }
        });
    }

    excluirColaboradoresProjeto() {

    }

    // TODO: Colocar no Colaborador Controller
    pesquisarColaboradorEmail() {
        event.preventDefault();
        let email = $('#InputEmail').val();
        console.log('procuraPorEmail', email);
        db.child(`usuario`).orderByChild('email').equalTo(email).on('child_added', snapshot => {
            if (snapshot.exists()) {
                this.convidaMembro(snapshot.val().uid);
            } else {
                alert('nao achou');
            }
        });
    }

    _criaProjeto() {
        let usuarioLogado = new Colaborador(this.user.id, true);
        return new Projeto(
            this._inputNome.val(),
            usuarioLogado
        );
    }

    _limpaFormulario() {
        this._inputNome.val("");
        this._inputNome.focus();
    }
}