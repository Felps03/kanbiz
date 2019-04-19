import $ from 'jquery';

import { db } from '../config/fb';

import { Controller } from './Controller';
import { TimeView } from '../views/TimeView';
import { Time } from '../models/Time';
import { Colaborador } from '../models/Colaborador';

export class TimeController extends Controller {
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
            $('#tfoot-body').empty();
            snapshot.forEach(value => {
                if (value.val()) {
                    db.child(`time/${value.key}`).on('value', snapshotTime => {
                        $('#table-body').append(this._timeView.linha(snapshotTime.val(), snapshotTime.key));
                    });
                } else {
                    db.child(`time/${value.key}`).on('value', snapshotTime => {
                        $('#tfoot-body').append(this._timeView.naoAceito(snapshotTime.val(), snapshotTime.key));
                    });
                }
            });
        });
        this.listaColaboradorTime();
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

    buscaDetalheTime() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let CHAVE = url.searchParams.get("chave");
        db.child('time').child(CHAVE).on('value', snapshot => {
            $('#UID').val(CHAVE);
            $('#InputNome').val(snapshot.val()._nome);
            $('#InputNick').val(snapshot.val()._nick);
        });
    }

    atualizaTime(event) {
        event.preventDefault();
        let time = this._criaTime();
        let chaveTime = $('#UID').val();
        let updates = {};
        updates[`/time/${chaveTime}`] = time;
        db.update(updates);
        $(location).attr('href', 'home.html')
    }

    // //TODO: Rever 
    procuraPorEmail(event) {
        event.preventDefault();
        let email = $('#InputEmail').val();
        console.log('procuraPorEmail', email);
        db.child(`usuario`).orderByChild('email').equalTo(email).on('child_added', snapshot => {
            if (snapshot.exists()) {
                this.convidaMembro(snapshot.val().uid);
            } else {
                alert('nao achou');
            }
        });
    }

    convidaMembro(uid) {

        let chaveTime = $('#UID').val();
        db.child('time').child(chaveTime).child('_colaboradores').update({
            [uid]: false
        }).then(function () {
            console.log('foi');
        });

        db.child(`colaboradores/${uid}/times`).update({
            [chaveTime]: false
        }).then(function () {
            alert('Colaborador Convidado');
            $(location).attr('href', 'home.html')
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
            $(location).attr('href', 'home.html')
        });
    }

    aceitaColaboradorTime(verficaAceite) {
        console.log(verficaAceite);
        let chaveTime = $("table tr:nth-child(2)").attr('id');
        db.child('time').child(chaveTime).child('_colaboradores').update({
            [this.user.id]: verficaAceite
        }).then(function () {
            console.log('foi');
        });

        db.child(`colaboradores/${this.user.id}/times`).update({
            [chaveTime]: verficaAceite
        }).then(function () {
            alert('Colaborador Convidado');
            $(location).attr('href', 'home.html')
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
            $(location).attr('href', 'home.html')
        });
    }


    aceitaColaboradorTime(verficaAceite = true) {
        let chaveTime = $("table tr:nth-child(2)").attr('id');
        db.child('time').child(chaveTime).child('_colaboradores').update({
            [this.user.id]: verficaAceite
        }).then(function () {
            console.log('foi');
        });

        db.child(`colaboradores/${this.user.id}/times`).update({
            [chaveTime]: verficaAceite
        }).then(function () {
            alert('Colaborador Convidado');
            $(location).attr('href', 'home.html')
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
            $(location).attr('href', 'home.html')
        });
    }


    recusarColaboradorTime() {
        let chaveTime = $("table tr:nth-child(2)").attr('id');
        db.child('time').child(chaveTime).child('_colaboradores').child(this.user.id).remove().then(function () {
            console.log('foi');
        });

        db.child(`colaboradores/${this.user.id}/times`).child(chaveTime).remove().then(function () {
            alert('ColaboradorDeletado');
            $(location).attr('href', 'home.html')
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
            $(location).attr('href', 'home.html')
        });
    }

    listaColaboradorTime() {
        let chaveTime = '-Lc3CVB29NPEMS4nsmNb';
        db.child(`time/${chaveTime}/_colaboradores`).on('value', snapshot => {
            console.log(snapshot.val());
            snapshot.forEach(value => {
                db.child(`usuario/${value.key}`).on('value', snapshotUsuario => {
                    console.log(snapshotUsuario.val());
                });
            });
        });
        return 0;
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
        this._inputNome.val("");
        this._inputNick.val("");
        this._inputNome.focus();
    }
}