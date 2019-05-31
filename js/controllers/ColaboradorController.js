import 'bootstrap';
import $ from 'jquery';

import { db, auth, storageRef } from '../config/fb';

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
        db.child(`usuario/${this.user.id}`).set(colaboradores);
    }

    adiciona(event) {
        event.preventDefault();
        this._limpaFormulario();
    }

    excluir() {
        let user = auth.currentUser;
        user.delete()
            .then(() => alert('Excluindo Usuario ...'))
            .catch(error => console.log("Erro EXCLUIR USUARIO - ", error));
    }

    _limpaFormulario() {
        this._inputNome.value = '';
        this._inputNome.focus();
    }

    atualizaColabadorador() {
        this._init();
        //console.log(this.user);
        let nome = this.user.nome ? this.user.nome : "";
        $("#InputNomeUser").val(nome);
        $("#InputEmailUser").val(this.user.email);
        $('#modalEditaPerfil').modal('show');
    }


    editaPerfil(event) {
        event.preventDefault();

        const fileInput = document.querySelector('#fotoPerfil').files[0];
        const refFoto = storageRef.ref('fotoPerfil');

        refFoto.child(this.user.id).put(fileInput).catch(error => {
            console.log("erro", error);
        });

        refFoto.child(this.user.id).getDownloadURL().then(url => {
            auth.currentUser.updateProfile({
                displayName: $("#InputNomeUser").val(),
                email: $("#InputEmailUser").val(),
                photoURL:url
            })
            .then(() => console.log(this.user.photoURL))
            .catch(error => console.log('erro ao atualizar perfil ', error))
            .finally(() => $('#modalEditaPerfil').modal('hide'));
        });
    }

    excluirPerfil(event) {
        event.preventDefault();
        auth.currentUser.delete()
            .then(() => $(location).attr('href', "index.html"))
            .catch(error => console.log('erro ao excluir perfil ', error));
    }
}