import { View } from './View';
import { truncar } from '../utils/utils';

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

    painelLateral(model, chave) {
        let urlTime = 'time.html?chave=' + chave;
        let nome = truncar(model._nome, 24)
        return `
            <a href='${urlTime}' class="list-group-item list-group-item-action bg-light">
                <i class="fas fa-users fa-1x"></i> ${nome}
            </a>
        `;
    }

    painelLateralNaoAceito(model, chave) {
        let nome = truncar(model._nome, 24);
        return `
            <a href='#' data-toggle="modal"
            data-target="#modalAceita" id="${chave}" class="list-group-item list-group-item-action bg-warning">
                <i class="fas fa-user-check fa-1x"></i> ${nome}
                <p style="display: none; id="nickPainelNaoAceito">${model._nick}</p>
            </a>
            
        `;
    }



    linha(model, chave) {
        var url = 'time.html?chave=' + chave;
        // return `<tr data-toggle="modal" data-target="#orderModal" data-id="${chave}">
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


    naoAceito(model, chave) {
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


    listaMembros(modal) {
        console.log(modal);
        

        let nome = typeof modal.nome === "undefined" ? '' :modal.nome;
        let foto = typeof modal.fotoUrl === "undefined" ? 'https://raw.githubusercontent.com/Felps03/kanbiz/master/images/placeholder.jpeg' : modal.fotoUrl;
        return `
            <li class="speaker">
                <figure class="speaker-portrait">
                    <img class="speaker-image" src="${foto}" alt="Foto do membro">
                    <figcaption class="speaker-name">${nome}</figcaption>
                    <p class="speaker-bio">${modal.email}</p>
                </figure>
            </li>
    `
            }
        
}