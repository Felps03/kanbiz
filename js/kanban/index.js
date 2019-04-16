import $ from 'jquery';

var Kanban = new jKanban({
    element: '#myKanban',
    gutter: '10px',
    widthBoard: '250px',
    click: function (el) {
        console.log("Trigger on all items click!");
    },
    buttonClick: function (el, boardId) {
        console.log(el);
        console.log(boardId);
        // create a form to enter element 
        var formItem = document.createElement('form');
        formItem.setAttribute("class", "itemform");
        formItem.innerHTML = '<div class="form-group"><textarea class="form-control" rows="2" autofocus></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Adicionar Cartão</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancelar</button></div>'

        Kanban.addForm(boardId, formItem);
        formItem.addEventListener("submit", function (e) {
            e.preventDefault();
            var text = e.target[0].value
            Kanban.addElement(boardId, {
                "title": text,
            })
            formItem.parentNode.removeChild(formItem);
        });
        document.getElementById('CancelBtn').onclick = function () {
            formItem.parentNode.removeChild(formItem)
        }
    },
    addItemButton: true,
    boards: [
        {
            "id": "_todo",
            "title": "Fazer",
            "class": "info",
            "dragTo": ['_working'],
            "item": [
                {
                    "id": "_test_delete",
                    "title": "Arrastar",
                },
                {
                    "title": "Clique Aqui!",
                    "click": function (el) {
                        alert("fazer algo");
                    },
                }
            ]
        },
        {
            "id": "_working",
            "title": "Fazendo",
            "class": "info",
            "item": [
                {
                    "title": "Faça alguma coisa!",
                },
                {
                    "title": "Teste 2?",
                }
                
            ]
        },
        {
            "id": "_done",
            "title": "Feito",
            "class": "info",
            "dragTo": ['_working'],
            "item": [
                {
                    "title": "OK",
                },
                {
                    "title": "Certo!",
                }
            ]
        },
        {
            "id": "_criarCard",
            "title": "Criar Card",
            "item": [
                {
                    "id" : "testeid",
                    "title": "Clique Aqui!",
                    "click": function (el) {                        
                        addNewBoard(el);
                        this.remove();
                    },
                }
            ]
        }
    ]
});


function addNewBoard(el) {
    novoId = "1";//buscar de um contador
    Kanban.addBoards(
        [{
            "id": novoId,
            "title": "Kanban Default",
            "item": [
                {
                    "id" : "testeid",
                    "title": "Clique Aqui!",
                    "click": function (element) {                        
                        addNewBoard(element); 
                        this.remove(); 
                    },                    
                }                           
            ]            
        }],
        
    );    
}

var addBoardDefault = document.getElementById('addDefault');
addBoardDefault.addEventListener('click', function () {
    Kanban.addBoards(
        [{
            "id": "_default",
            "title": "Kanban Default",
        }]
    )
});

var removeBoard = document.getElementById('removeBoard');
removeBoard.addEventListener('click', function () {
    Kanban.removeBoard('_done');
});

var removeElement = document.getElementById('removeElement');
removeElement.addEventListener('click', function () {
    Kanban.removeElement('_test_delete');
});

var allEle = Kanban.getBoardElements('_todo');
allEle.forEach(function (item, index) {
    // console.log(item);
})


/*
var toDoButton = document.getElementById('addToDo');
toDoButton.addEventListener('click', function () {
    Kanban.addElement(
        "_todo",
        {
            "title": "Test Add",
        }
    );
});
*/