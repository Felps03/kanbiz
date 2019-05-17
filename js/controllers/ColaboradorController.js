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

        const file = document.querySelector('#fotoPerfil').files[0]
        const name = (this.user.id + file.name);
        const metadata = {
            contentType: file.type
        };
        /*
        console.log(file);
        console.log(name);
        console.log(metadata);
*/
        const task = storageRef.ref(name).put(file, metadata);
        //      console.log(task);

        task.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
            });
        });

        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            auth.currentUser.updateProfile({
                displayName: $("#InputNomeUser").val(),
                email: $("#InputEmailUser").val(),
                photoURL:downloadURL
            })
                .then(() => console.log('aqui'))
                .catch(error => console.log('erro ao atualizar perfil ', error))
                .finally(() => $('#modalEditaPerfil').modal('hide'));
            console.log('File available at', );
        });

    
    }

    excluirPerfil(event) {
        event.preventDefault();
        auth.currentUser.delete()
            .then(() => $(location).attr('href', "index.html"))
            .catch(error => console.log('erro ao excluir perfil ', error));
    }
}