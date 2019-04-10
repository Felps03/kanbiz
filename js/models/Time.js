export class Time {
    constructor(nome, nick, colaboradores){
        this._nome = nome;
        this._nick = nick;
        this._colaboradores = colaboradores;
        Object.freeze(this);
    }

    get id() {
        return this._id;
    }

    get projeto() {
        return this._projeto;
    }

    get colaboradores() {
        return this._colaboradores;
    }

    set addColaborador(colaborador) {
        this._colaboradores = colaborador;
    }

    get nome() {
        return this._nome;
    }

    get nick() {
        return this._nick;
    }
}