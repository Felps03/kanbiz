export class Cartao {

    constructor(uidBord, titulo, descricao = null, dataEntrega = null, uidCartao = null, uidColunaAtual = null) {
        this.uidBord = uidBord;
        this.title = titulo;
        this.descricao = descricao;
        this.dataEntrega = dataEntrega;
        this.uidCartao = uidCartao;
        this.uidColunaAtual = uidColunaAtual;
    }


  

    get titulo() {
        return this.title;
    }

    // constructor(nome, descricao, dataEntregue, pendencia, prioridades, colaboradores) {
    //     this._nome = nome;
    //     this._descricao = descricao;
    //     this._dataEntregue = dataEntregue;
    //     this._pendencia = pendencia;
    //     this._prioridades = prioridades;
    //     this._colaboradores = colaboradores;
    // }

    // get nome() {
    //     return this._nome;
    // }

    // get descricao() {
    //     return this._descricao;
    // }

    // get dataEntregue() {
    //     return this._dataEntregue;
    // }

    // get pendencia() {
    //     return this._pendencia;
    // }

    // get prioridades() {
    //     return this._prioridades;
    // }

    // get colaboradores() {
    //     return this._colaboradores;
    // }
}