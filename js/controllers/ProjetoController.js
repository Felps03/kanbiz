import $ from 'jquery';

import {db} from '../config/fb';

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

    onUserLogged(){
        this._init();
    }

    _init(){
        this._timeView.render();
        db.child(`colaboradores/${this.user.id}/projeto`).on('value', snapshot => {
            $('#table-body-Projeto').empty();
            snapshot.forEach(value => {
                if(value.val()) {
                    db.child(`projeto/${value.key}`).on('value', snapshotProjeto => {
                        $('#table-body-Projeto').append(this._timeView.linha(snapshotProjeto.val(), snapshotProjeto.key));
                    })
                }
            });
        });

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

    listaColaboradoresProjeto(){

    }

    excluirColaboradoresProjeto(){

    }

    pesquisarColaboradorEmail(){

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