import $ from 'jquery';
import {db, auth} from '../config/fb';

import {Controller} from '../controllers/Controller';
import {TimeView} from '../views/TimeView';
import {Time} from '../models/Time';
import {Colaborador} from '../models/Colaborador';

export class TimeController extends Controller{
    constructor() {
        super();
        this._inputNome = $('#InputNome');
        this._inputNick = $('#InputNick');
        
        this._timeView = new TimeView($('#timeView'));   
    }

    onUserLogged() {
        this._init();
    }

    _init() {
        this._timeView.render();
        db.child(`colaboradores/${this.user.id}/times`).on('value', snapshot => {
            $('#table-body').empty();
            snapshot.forEach(value => {
                if(value.val()){
                    if(!value.exists()){
                        alert('Voce ainda nao possui time');
                    }
                    db.child(`time/${value.key}`).on('value', snapshotTime => {
                        $('#table-body').append(this._timeView.linha(snapshotTime.val(), snapshotTime.key));
                    });
                }
            });
        });
    }

    adicionaTime(event) {
        event.preventDefault();
        let time = this._criaTime();
        db.child('time').push(time).then(snapshot => {
            this._adicionaTimeColaborador(this.user.id, snapshot.key);
        }).catch(function (error) {
            console.error("Erro ao criar Time ", error);
        });
        this._limpaFormulario();
    }

    _adicionaTimeColaborador(chaveUsuario, chaveTime) {
        db.child(`colaboradores/${chaveUsuario}/times`).update({
            [chaveTime]: true
        }).then(function () {
            console.info("Criou o Time Colaborador ");
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
        });
    }    

    _criaTime() {
        let usuarioLogado = new Colaborador(this.user.id, true);
        return new Time(
            this._inputNome.val(),
            this._inputNick.val(),
            usuarioLogado
        );
    }

    _limpaFormulario() {
        this._inputNome = '';
        this._inputNick = '';
        // $( "#target" ).focus();
    }
}