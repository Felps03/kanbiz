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
            console.log("Colecao Usuario", colaboradores);
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
}