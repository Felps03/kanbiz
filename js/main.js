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
    let emailInput = $('#emailInput').val();
    let senhaInput = $('#passwordInput').val();
    auth.createUserWithEmailAndPassword(emailInput, senhaInput)
        .then(function () {
            alert('Bem vindo ' + emailInput);
            window.location.href = paginaHome;
        }).catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao cadastrar, verifique o erro no console.')
        });
});

/**
 * Autenticar com E-mail e Senha
 * @param {String} emailInput email do usuario
 * @param {String} senhaInput senha do usuario
 */
$("#authEmailPassButton").click( function() {
    let emailInput = $('#emailInput').val();
    let senhaInput = $('#passwordInput').val();
    let displayName = $('#displayName');
    auth.signInWithEmailAndPassword(emailInput, senhaInput).then(function (result) {
            console.log(result);
            displayName.innerText = 'Bem vindo, ' + emailInput;
            alert('Autenticado ' + emailInput);
            window.location.href = paginaHome;
        }).catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

/**
 * Logout
 */
$("#logOutButton").click( function() {
    auth.signOut().then(function () {
        displayName.innerText = 'Você não está autenticado';
        alert('Você se deslogou');
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
        displayName.innerText = 'Bem vindo, ' + result.user.displayName;
        window.location.href = paginaHome;
    }).catch(function (error) {
        console.log(error);
        alert('Falha na autenticação');
    });
}
