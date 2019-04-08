import $ from 'jquery';

import {auth} from '../config/fb';

export class Controller {
    constructor() {
        const that = this;
        auth.onAuthStateChanged((user) => {
            if (user) {
                that.user = {
                    id: user.uid,
                    nome: user.displayName, 
                    email: user.email,
                    emailVerificado: user.emailVerified,
                    fotoUrl: user.photoURL,
                    anonimo: user.isAnonymous,
                    providerData: user.providerData
                };
                //TODO: Remover
                let nome = user.displayName ? user.displayName : user.email;
                $('#displayName').text(`Bem Vindo: ${nome}`);
            } else {
                alert('Você não está autorizado a exibir esta página');
                $(location).attr('href', "index.html");
            }
            this.onUserLogged();
        });
    }

    onUserLogged() {
        throw new Error('O método usuariook deve ser implementado');
    }
}