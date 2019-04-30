import {View} from './View';

export class ColunaView extends View {

    constructor(elemento) {
        super(elemento);
    }

    template() {
        return `
            <div class="form-group">
                <textarea class="form-control" rows="2" autofocus></textarea>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-xs pull-right">
                    Adicionar Cartão
                </button>
                <button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">
                    Cancelar
                </button>
            </div>
        `;
    }
    
    static opcoesDoCartao() {
        return `
            <div class="opcoesDoCartao">
                <button class="opcoesDoCartao-remove opcoesDoCartao-opcao" tabindex="-1">Remover</button>
                <button class="opcoesDoCartao-edita opcoesDoCartao-opcao" tabindex="-1">Editar</button>
                <input type="radio" value="0" class="opcoesDoCartao-radioTipo" name="tipoDoCartao-0" id="tipoPadrão-cartao0">
                <label class="opcoesDoCartao-tipo opcoesDoCartao-tipoPadrão opcoesDoCartao-opcao" for="tipoPadrão-cartao0" tabindex="-1" style="color: rgb(235, 239, 64);">Padrão</label>
                <input type="radio" value="1" class="opcoesDoCartao-radioTipo" name="tipoDoCartao-0" id="tipoImportante-cartao0"><label class="opcoesDoCartao-tipo opcoesDoCartao-tipoImportante opcoesDoCartao-opcao" for="tipoImportante-cartao0" tabindex="-1" style="color: rgb(240, 84, 80);">Importante</label>
                <input type="radio" value="2" class="opcoesDoCartao-radioTipo" name="tipoDoCartao-0" id="tipoTarefa-cartao0"><label class="opcoesDoCartao-tipo opcoesDoCartao-tipoTarefa opcoesDoCartao-opcao" for="tipoTarefa-cartao0" tabindex="-1" style="color: rgb(146, 196, 236);">Tarefa</label>
                <input type="radio" value="3" class="opcoesDoCartao-radioTipo" name="tipoDoCartao-0" id="tipoInspiração-cartao0"><label class="opcoesDoCartao-tipo opcoesDoCartao-tipoInspiração opcoesDoCartao-opcao" for="tipoInspiração-cartao0" tabindex="-1" style="color: rgb(118, 239, 64);">Inspiração</label>
            </div>
        `
    }
   

}