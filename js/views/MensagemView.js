import { View } from './View';

export class MensagemView extends View {

    constructor(elemento) {
        super(elemento);
    }

    template(texto) {
        return texto ? `<p class="alert alert-dark">${texto}</p>` : '<p></p>';
    }
}