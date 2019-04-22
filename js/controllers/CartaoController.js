import $ from 'jquery';

import {db} from '../config/fb';

import { Controller } from './Controller';
import { Cartao } from '../models/Cartao';

export class CartaoController extends Controller {
    constructor() {
        super();
    }

    onUserLogged() {}


    adicionaCartao(event) {
        event.preventDefault();
        console.log('chegou adicionaCartao');
        let cartao = this._criaCartao();
        db.child('cartao').push(cartao).then(snapshot => {
            this.adicionaCartaoColuna(snapshot.key);
        }).catch(function (error) {
            console.error("Erro ao criar projeto ", error);
        });
    }

    atualizaCartao(event) {
        event.preventDefault();
        let cartao = this._criaCartao();
        let chaveCartao = $('#UID').val();
        let updates = {};
        updates[`/cartao/${chaveCartao}`] = cartao;
        db.update(updates);
        $(location).attr('href', 'home.html');
    }

    adicionaCartaoColuna(cartaoChave) {

        let chaveColuna = '-LcmVhH4SYEt2wB-ei45'

        db.child(`coluna/${chaveColuna}/cartao`).update({
            [cartaoChave] : true
        }).then(function () {
            console.info("Criou o Cartao com sucesso ");
        }).catch(function (error) {
            console.error("Erro ao criar adicionaCartao ", error);
        });
    }
    
    _criaCartao() {
        let cartao = 'teste 3';
        return new Cartao (
            cartao
        )
    }

    _limpaFormulario() {

    }
}