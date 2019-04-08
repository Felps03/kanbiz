export class Projeto {
    constructor(id, nome, colunas, colaborador) {
        this._id = id;
        this._nome = nome;
        this._colunas = colunas;
        this._colaborador = colaborador;
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