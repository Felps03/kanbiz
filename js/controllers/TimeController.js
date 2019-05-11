import $ from 'jquery';
import * as bootstrap from "bootstrap";

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
        $("#lds-spinner").show();
        db.child(`colaboradores/${this.user.id}/times`).on('value', snapshot => {
            $('#times-painel-lateral').empty();
            $('#times-painel-lateral-nao-aceito').empty();
            if (snapshot.exists()) {
                snapshot.forEach(value => {
                    if (value.val()) {
                        db.child(`time/${value.key}`).on('value', snapshotTime => {
                            $('#times-painel-lateral').append(this._timeView.painelLateral(snapshotTime.val(), snapshotTime.key));
                        });
                    } else {
                        db.child(`time/${value.key}`).on('value', snapshotTime => {
                            $('#times-painel-lateral-nao-aceito').append(this._timeView.painelLateralNaoAceito(snapshotTime.val(), snapshotTime.key));
                        });
                    }
                    $("#lds-spinner").hide();
                });
            } else {
                $("#lds-spinner").hide();
            }
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
        console.log($('#modalCriaTime'));
        $('#modalCriaTime').modal('hide');
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
        $(".d-flex").removeClass("fundoCinza");
        $('#formTimeTudo').show();
        $("#projetosTime").hide();
        $('#panel-speakers').hide();
        db.child('time').child(this._recuperaChaveTime()).on('value', snapshot => {
            $('#UID').val(snapshot.key);
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
        $(location).attr('href', 'home.html');
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
            $(location).attr('href', 'home.html');
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
            $(location).attr('href', 'home.html');
        });
    }

    aceitaColaboradorTime(chaveTime, verficaAceite) {
        db.child('time').child(chaveTime).child('_colaboradores').update({
            [this.user.id]: verficaAceite
        }).then(function () {
            console.log('aceitaColaboradorTime');
        });

        db.child(`colaboradores/${this.user.id}/times`).update({
            [chaveTime]: verficaAceite
        }).then(function () {
            alert('Colaborador Convidado');
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
            $(location).attr('href', 'home.html');
        });
    }

    recusarColaboradorTime(chaveTime) {
        db.child('time').child(chaveTime).child('_colaboradores').child(this.user.id).remove().then(function () {
            console.log('recusarColaboradorTime');
        });
        db.child(`colaboradores/${this.user.id}/times`).child(chaveTime).remove().then(function () {
            alert('ColaboradorDeletado');
        }).catch(function (error) {
            console.error("Erro ao criar timeColaborador ", error);
        });
    }

    listaColaboradorTime() {
        $(".d-flex").addClass("fundoCinza");
        $('#listaMembros').empty();
        let chaveTime = this._recuperaChaveTime();
        db.child(`time/${chaveTime}/_colaboradores`).on('value', snapshot => {
            snapshot.forEach(value => {
                db.child(`usuario/${value.key}`).on('value', snapshotUsuario => {
                    $('#formTimeTudo').hide();
                    $("#projetosTime").hide();
                    $('#panel-speakers').show();
                    $('#listaMembros').append(this._timeView.listaMembros(snapshotUsuario.val()));
                });
            });
        });
    }

    _recuperaChaveTime() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        return (url.searchParams.get("chave"));
    }

    _criaTime() {
        let usuarioLogado = new Colaborador(this.user.id, true);
        return new Time(
            this._inputNome.val(),
            this._inputNick.val(),
            usuarioLogado
        );
    }

    projetoTime() {
        $("#panel-speakers").hide();
        $("#formTimeTudo").hide();
        $("#projetosTime").show();
        let that = this;
        db.child(`time/${this._recuperaChaveTime()}/_projeto`).on('value', snapshot => {
            if (snapshot.exists()) {
                $('#painelProjetoPrincipal').empty();
                snapshot.forEach(value => {
                    db.child(`projeto/${value.key}`).once('value', snapshotProjeto => {
                        $('#painelProjetoPrincipal').append(that._timeView.linha(snapshotProjeto.val(), snapshotProjeto.key));
                    })
                })
            }
        });
    }

    criaProjetoTime(event) {
        // event.preventDefault();
        let projeto = {
            _time: this._recuperaChaveTime(),
            _nome: "Felipe",
            _colaboradores: {
                [this.user.id]: true
            },
            admin: {
                bloqueado: false,
                finalizado: false,
                arquivado: false,
            }
        };
        db.child('projeto').push(projeto).then(snapshot => {
            db.child(`colaboradores/${this.user.id}/projeto`).update({
                [snapshot.key]: {
                    admin: true
                }
            });
            db.child(`time/${this._recuperaChaveTime()}/_projeto`).update({
                [snapshot.key]: true
            });
        }).catch((error) => console.error("Erro ao criar Projeto ", error))
            .finally(() => $('#modalCriaProjeto').modal('hide'));
        this._limpaFormulario();

    }

    // TODO: Deve excluir os times vinculados
    _excluirTime() {
        db.child(`time/${this._recuperaChaveTime()}`).remove();
        $(location).attr('href', 'home.html');
    }

    _limpaFormulario() {
        this._inputNome.val("");
        this._inputNick.val("");
        this._inputNome.focus();
    }
}