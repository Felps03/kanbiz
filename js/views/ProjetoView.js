import {View} from './View';

export class ProjetoView extends View {
    
    constructor(elemento) {
        super(elemento);
    }
    
    template() {
        return `
            <table class="table table-striped">
                
                    <tr>
                        <th>NOME</th>
                        <th>CHAVE</th>
                        <th>acao</th>
                    </tr>
                
                <tbody id="table-body-Projeto">
                </tbody>

                <tfoot id="tfoot-body-Projeto">
                </tfoot>

            </table>
        `;
    }
    
    linha(model, chave) {
        var url = 'projeto.html?chave=' + chave;
        // return `<tr data-toggle="modal" data-target="#orderModal" data-id=${chave}>
        return `<tr onclick="window.location.href = '${url}'";>
                    <td>${model._nome}</td>
                    <td>${chave}</td>
                    <td>
                        <a class="edit" title="Edit" data-toggle="tooltip">
                            <i class="fa fa-pencil-square-o fa-2x" aria-hidden="true"></i>    
                        </a>
                        <a class="delete" title="Delete" data-toggle="tooltip">
                            <i class="fa fa-trash fa-2x" aria-hidden="true">
                        </i>
                    </a>
                </td>
                </tr>
        `;
    }

}