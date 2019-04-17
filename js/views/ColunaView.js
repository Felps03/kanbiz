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

}