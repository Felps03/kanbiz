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
        this._init();
        // this.verificaUsuarioLogado();
    }

    usuariook() {
        console.log(this.that);
    }

    _init() {
        this._timeView.render();
        auth.onAuthStateChanged((user) => {
            db.child(`colaboradores/${user.uid}/times`).on('value', snapshot => {
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
        });
    }

    verificaUsuarioLogado() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                let uid = user.uid;
                let nomeDisplayName = user.displayName;
                let email = user.email;
                let emailVerified = user.emailVerified;
                let photoURL = user.photoURL;
                let isAnonymous = user.isAnonymous;
                let providerData = user.providerData;
                UID_USER = uid;
                EMAIL_USER = email;
                let nome = nomeDisplayName ? nomeDisplayName : email;
                $('#displayName').text(`Bem Vindo: ${nome}`);
            } else {
                alert('Você não está autorizado a exibir esta página');
                $(location).attr('href', "login.html");
            }
        });
        return new Colaborador(UID_USER, true);
    }

    adicionaTime(event) {
        console.log(this._timeView);
        event.preventDefault();
        let time = this._criaTime();
        db.child('time').push(time).then(snapshot => {
            this._adicionaTimeColaborador(UID_USER, snapshot.key);
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
            $(location).attr('href', "home.html");
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
        });
    }    

    _criaTime() {
        let usuarioLogado = this.verificaUsuarioLogado();
        return new Time(
            this._inputNome.value,
            this._inputNick.value,
            usuarioLogado
        );
    }

    _limpaFormulario() {
        this._inputNome.value = '';
        this._inputNick.value = '';
        this._inputNome.focus();
    }
}