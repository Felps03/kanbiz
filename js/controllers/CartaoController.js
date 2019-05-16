import $ from 'jquery';
import * as bootstrap from "bootstrap";

import { db } from '../config/fb';

import { Controller } from './Controller';
import { Cartao } from '../models/Cartao';

export class CartaoController extends Controller {
    constructor(kb) {
        super();
        this._kanban = kb;
        this._InputUIDColuna = $("#InputUID");
        this._InputCartao = $("#InputCartao");
    }

    onUserLogged() { }

    adicionaCartaoModal(event) {
        event.preventDefault();
        $('#modalCriaCartao').modal('show');
        const boardId = event.target.parentNode.parentNode.dataset.id;
        $('#InputUID').val(boardId)
    }

    adicionaCartao(event) {
        event.preventDefault();
        let cartao = this._criaCartao();
        db.child(`projeto/${this._recuperaChaveProjeto()}/_admin`).once('value', snapshot => {
            if ((!snapshot.val().bloqueado) && (!snapshot.val().arquivado) && (!snapshot.val().finalizado)) {
                db.child('cartao').push(cartao).then(snapshot => {
                    this.adicionaCartaoColuna(snapshot.key, cartao.uidBord);
                }).catch(error => console.error("Erro ao criar projeto ", error));
            }
        });
        $('#modalCriaCartao').modal('hide');
        this._limpaFormulario();
    }

    atualizaCartao(event) {
        event.preventDefault();
        let cartao = this._criaCartao();
        let updates = {};
        updates[`/cartao/${cartao.uidBord}`] = cartao;
        db.update(updates);
        $(location).attr('href', 'home.html');
    }

    adicionaCartaoColuna(cartaoChave, chaveColuna) {
        db.child(`coluna/${chaveColuna}/cartao`).update({
            [cartaoChave]: true
        })
        .then(() => console.info("Criou o Cartao com sucesso "))
        .catch(error => console.error("Erro ao criar adicionaCartao ", error));
    }

    _criaCartao() {
        return new Cartao(
            this._InputUIDColuna.val(),
            this._InputCartao.val()
        )
    }

    _limpaFormulario() {
        this._InputUIDColuna.val('');
        this._InputCartao.val('');
    }

    _recuperaChaveProjeto() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        return (url.searchParams.get("chave"));
    }
}