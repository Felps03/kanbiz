import { View } from './View';

export class ProjetoView extends View {

    constructor(elemento) {
        super(elemento);
    }

    template() {
        return ``;
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


    painel(model, chave) {

        var url = 'projeto.html?chave=' + chave;
        return `
            <article class="style2">
                <span class="image">
                    <img src="https://raw.githubusercontent.com/Felps03/kanbiz/master/images/pic02.jpg" alt="" />
                </span>
                <a href="${url}">
                    <h2>${model._nome}</h2>
                    <div class="content" style="display: none;">
                        <p>Sed nisl arcu euismod sit amet nisi lorem etiam dolor veroeros et feugiat.</p>
                    </div>
                </a>
            </article>
      
        `
    }

    membroProjeto(model, count) {
        let nome = model.nome ? model.nome : "";
        return ` 
            <tr>
                <th scope="row">${count}</th>
                <td>${model.email}</td>
                <td>${nome}</td>
            </tr>
        `
    }
}