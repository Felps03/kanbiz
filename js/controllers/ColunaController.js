import $ from 'jquery';

import {db} from '../config/fb';

import { Controller } from './Controller';
import { Coluna } from '../models/Coluna';

export class ColunaController extends Controller {
    constructor() {
        super();
        this._inputTitle = $('#InputTituloColuna');
        this._inputClass = $('#InputClasseColuna');
        this._inputLimitador = $('#InputLimitadorColuna');
    }

    onUserLogged() {
        this._init();
    }

    _init() {
        db.child(`coluna/`).on('value', snapshot => {
            snapshot.forEach(value => {
                console.log(value.val().title);
                console.log(value.val().class);
                console.log(value.val().limit);
            });
        });
    }

    adicionaColuna(event) {
        event.preventDefault();
        let coluna = this._criaColuna();
        db.child('coluna').push(coluna).then(snapshot => {
            console.info("criou");
        }).catch(function (error) {
            console.error("Erro ao criar projeto ", error);
        });
        this._limpaFormulario();
    }

    _criaColuna() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let CHAVE = url.searchParams.get("chave");
        return new Coluna(
            CHAVE,
            this._inputTitle.val(),
            // this._inputClass.val(),
            // this._inputLimitador.val()
        );
    }

    _limpaFormulario() {
        this._inputTitle.value = '';
        this._inputClass.value = '';
        this._inputLimitador.value = '';
        this._inputTitle.focus();
    }
}
