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
        console.log('chegou');
        let cartao = this._criaCartao();
        db.child('cartao').push(cartao).then(snapshot => {
            this.adicionaCartaoColuna(snapshot.key);
        }).catch(function (error) {
            console.error("Erro ao criar projeto ", error);
        });
    }

    adicionaCartaoColuna(cartaoChave) {

        let chaveColuna = '-LclJBWG2_eXxaqsadhg'

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