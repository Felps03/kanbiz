export class Projeto {
    constructor(nome, colaborador, colunas = null) {
        this._nome = nome;
        this._colaborador = colaborador;
        this._colunas = colunas;
    }

    get id() {
        return this._id;
    }

    get nome() {
        return this._nick;
    }

    get colunas() {
        return this._colunas;
    }

    get colaborador() {
        return this._colaborador;
    }
}