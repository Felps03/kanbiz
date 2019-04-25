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
            if (snapshot.exists()) {
                snapshot.forEach(value => {
                    if (value.val()) {
                        db.child(`projeto/${value.key}`).on('value', snapshotProjeto => {
                            $("#lds-spinner").hide();
                            $('#table-body-Projeto').append(this._timeView.linha(snapshotProjeto.val(), snapshotProjeto.key));
                        })
                    }
                });
            } else {
                $("#lds-spinner").hide();
            }
        });

        this.excluirProjeto();
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

    editarProjeto(event) {
        event.preventDefault();
        let projeto = this._criaProjeto();
        let chaveProjeto = $('#UID').val();
        let updates = {};
        updates[`/projeto/${chaveProjeto}`] = projeto;
        db.update(updates);
        $(location).attr('href', 'home.html');
    }

    excluirProjeto() {

        let chaveProjeto = '-LdJIDgn2K9drJoXw4FF';

        db.child(`projeto/${chaveProjeto}/_colaboradores`).on('child_added', snapshot => {
            if (snapshot.exists()) {
                db.child(`colaboradores/${snapshot.key}/projeto/`).child(chaveProjeto).remove().then(function () {
                    console.log('Colaborador Deletado do Projeto');
                        db.child(`projeto/${chaveProjeto}`).remove().then(function () {
                            console.log('Deletado o Projeto');
                        }).catch(function (error) {
                            console.error("Erro ao excluir Projeto ", error);
                        });
                }).catch(function (error) {
                    console.error("Erro ao excluir colaboradores/Projeto ", error);
                });
            }
        })
        

    };


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

    // TODO: Colocar no Colaborador Controller
    // pesquisarColaboradorEmail() {
    _pesquisarColaboradorEmail(email) {
        // event.preventDefault();
        // let email = $('#InputEmail').val();
        console.log('procuraPorEmail', email);
        db.child(`usuario`).orderByChild('email').equalTo(email).on('child_added', snapshot => {
            console.log('_pesquisarColaboradorEmail: snapshot.exists()');
            if (snapshot.exists()) {
                console.log('_pesquisarColaboradorEmail: ', snapshot.val().uid);
                return (snapshot.val().uid);
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