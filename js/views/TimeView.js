import {View} from './View';

export class TimeView extends View {
    
    constructor(elemento) {
        super(elemento);
    }
    
    template() {
        return `
            <table class="table table-striped">
                
                    <tr>
                        <th>NOME</th>
                        <th>Nick</th>
                        <th>Chave</th>
                        <th>acao</th>
                    </tr>
                
                <tbody id="table-body">
                </tbody>

                <tfoot id="tfoot-body">
                </tfoot>

            </table>
        `;
    }
    
    linha(model, chave) {
        var url = 'time.html?chave=' + chave;

        // return `<tr data-toggle="modal" data-target="#orderModal" data-id=${chave}>
        return `<tr onclick="window.location.href = '${url}'";>
                    <td>${model._nome}</td>
                    <td>${model._nick}</td>
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


    naoAceito(model, chave){
        // var url = 'time.html?chave=' + chave;
        return `<tr> <td colspan="3" class="text-center"> Times nao aceito </td></tr>
                <tr id=${chave}>
                    <td>${model._nome}</td>
                    <td>${model._nick}</td>
                    <td>${chave}</td>
                    <td>
                        <a class="aceita" title="Aceitar" data-toggle="tooltip">
                            <i class="fa fa-check fa-2x" aria-hidden="true"></i>
                        </a>
                        <a class="deleta" title="Excluir" data-toggle="tooltip">
                            <i class="fa fa-trash fa-2x" aria-hidden="true"></i>
                        </a>
                    </td>
                </tr>
                `
    }

}