export class Projeto {
    constructor(nome, colaboradores, admin, colunas = null) {
        this._nome = nome;
        this._colaboradores = colaboradores;
        this._admin = admin;
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
        return this._colaboradores;
    }
}