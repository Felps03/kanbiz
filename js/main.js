import $ from 'jquery';
//require('../home.html');
import {auth, provider} from '../js/config/fb';

let paginaHome = "home.html";

/**
 * Criar um novo Usuario
 * @param {String} emailInput email do usuario
 * @param {String} senhaInput senha do usuario
 */
$("#createUserButton").click( function() {
    $("#mensagemView").empty();
    let emailInput = $('#emailInput').val();
    let senhaInput = $('#passwordInput').val();
    auth.createUserWithEmailAndPassword(emailInput, senhaInput)
        .then(function () {
            alert('Bem vindo ' + emailInput);
            window.location.href = paginaHome;
        }).catch(function (error) {
            $("#mensagemView").append(mensagemView("A senha deve ter pelo menos 6 caracteres"));
        });
});

/**
 * Autenticar com E-mail e Senha
 * @param {String} emailInput email do usuario
 * @param {String} senhaInput senha do usuario
 */
$("#authEmailPassButton").click( function(e) {
    e.preventDefault();
    $("#mensagemView").empty();
    let emailInput = $('#emailInput').val();
    let senhaInput = $('#passwordInput').val();
   
    auth.signInWithEmailAndPassword(emailInput, senhaInput).then(function (result) {
        window.location.href = paginaHome;    
        
        console.log(window.location.href);
        debugger;
        }).catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            $("#mensagemView").append(mensagemView("A senha é inválida"));
        });
});

/**
 * Logout
 */
$("#logOutButton").click( function() {
    auth.signOut().then(function () {
        displayName.innerText = 'Você não está autenticado';
        // alert('Você se deslogou');
        window.location.href = paginaHome;
    }, function (error) {
        console.error(error);
    });
});

/**
 * Autenticar com o Google
 */
$("#authGoogleButton").click( function() {
    signIn(provider);
});

function signIn(provider) {
    auth.signInWithPopup(provider).then(function (result) {
        console.log(result);
        window.location.href = paginaHome;
    }).catch(function (error) {
        console.log(error);
        alert('Falha na autenticação Provedor');
    });
}


function mensagemView(texto){ 
    return `<p class="alert alert-dark">${texto} </p>`
}