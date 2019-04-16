export class Coluna {
    constructor(projeto, titulo, classe = 'info', limitador = 3, item = null) {
        this._projeto = projeto;
        this.title = titulo;
        this.class = classe;
        this.limit = limitador;
        this.item = item;
    }

    get projeto(){
        return this._projeto;
    }

    get titulo() {
        return this.title;
    }

    get classe() {
        return this.class;
    }

    get limitador() {
        return this.limit;
    }
}