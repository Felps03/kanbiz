import {View} from './View';

export class TimeView extends View {
    
    constructor(elemento) {
        super(elemento);
    }
    
    template() {
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>NOME</th>
                        <th>Nick</th>
                        <th>Chave</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        `;
    }
    
    linha(model, chave) {
        var url = 'time.html?chave=' + chave;
        return `<tr onclick="window.location.href = '${url}'";>
                    <td>${model._nome}</td>
                    <td>${model._nick}</td>
                    <td>${chave}</td>
                </tr>
        `;
    }
}