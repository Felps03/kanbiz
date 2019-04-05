export class Coluna {

    constructor(nome, cartoes, limitador) {
        this._nome = nome;
        this._cartoes = cartoes;
        this._limitador = limitador;
    }

    get nome() {
        return this._nome;
    }

    get cartoes() {
        return this._cartoes;
    }

    get limitador() {
        return this._limitador();
    }

}