import 'bootstrap';
import $ from 'jquery';

import { db, auth } from '../config/fb';

import { Controller } from './Controller';

export class ColaboradorController extends Controller {
    constructor() {
        super();
    }

    onUserLogged() {
        this._init();
    }

    _init() {
        let colaboradores = {
            uid: this.user.id,
            nome: this.user.nome,
            email: this.user.email,
            fotoUrl: this.user.fotoUrl,
        }
        db.child(`usuario/${this.user.id}`).set(colaboradores).then(snapshot => {
            // console.log("Colecao Usuario", colaboradores);
        });
    }

    adiciona(event) {
        event.preventDefault();
        this._limpaFormulario();
    }

    excluir() {
        let user = auth.currentUser;
        user.delete().then(function () {
            alert('Excluindo Usuario ...');
        }).catch(function (error) {
            console.log("Erro EXCLUIR USUARIO - ", error);
        });
    }

    _limpaFormulario() {
        this._inputNome.value = '';
        this._inputNome.focus();
    }

    atualizaColabadorador() {
        this._init();
        console.log(this.user);
        let nome = this.user.nome ? this.user.nome : "";
        $("#InputNomeUser").val(nome);
        $("#InputEmailUser").val(this.user.email);
        $('#modalEditaPerfil').modal('show');
    }


    editaPerfil(event) {
        event.preventDefault();
        auth.currentUser.updateProfile({
            displayName: $("#InputNomeUser").val(),
            email: $("#InputEmailUser").val()
        }).then(function () {
            $(location).attr('href', "home.html");
        }).catch(function (error) {
            console.log('erro ao atualizar perfil ', error);
        });
        $('#modalEditaPerfil').modal('hide');
    }

    excluirPerfil(event) {
        event.preventDefault();
        auth.currentUser.delete().then(function () {
            $(location).attr('href', "index.html");
        }).catch(function (error) {
            console.log('erro ao excluir perfil ', error);
        });
    }
}