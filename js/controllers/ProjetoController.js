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
                        $("#lds-spinner").hide();
                        $('#painelProjetoPrincipal').append(this._timeView.painel(snapshotProjeto.val(), snapshotProjeto.key));

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
                [snapshot.key] :  {
                    admin : true
                }
            }).then( () => console.info("Colaborador vinculado com o Projeto com sucesso"))
            .catch( (error) => console.error("Erro ao vincular projeto ao Colaborador ", error));
        }).catch( (error) => console.error("Erro ao criar Projeto ", error))
        .finally( () => $('#modalCriaProjeto').modal('hide')); 
        this._limpaFormulario();
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

        let chaveProjeto = '-LdLdhLTmuAjgsFHrOY8';

        db.child(`projeto/${chaveProjeto}/_colaboradores`).on('child_added', snapshot => {
            if (snapshot.exists()) {
                db.child(`colaboradores/${snapshot.key}/projeto/`).child(chaveProjeto).remove().then(function () {
                    console.log('Excluido o projeto do Colaborador');
                    return db.child(`projeto/${chaveProjeto}`).remove();
                }).then(function (ok) {
                    console.log('Ambos excluidos');
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

    _pesquisarColaboradorEmail(email) {
        console.log('procuraPorEmail', email);
        db.child(`usuario`).orderByChild('email').equalTo(email).on('child_added', snapshot => {
            if (snapshot.exists()) {
                return (snapshot.val().uid);
            } else {
                alert('nao achou');
            }
        });
    }

    _criaProjeto() {
        let usuarioLogado = new Colaborador(this.user.id, true);
        let _admin =  {
            bloqueado : false,
            finalizado : false,
            arquivado : false,
        }
        return new Projeto(
            this._inputNome.val(),
            usuarioLogado, 
            _admin
        );
    }

    _limpaFormulario() {
        this._inputNome.val("");
        this._inputNome.focus();
    }
}