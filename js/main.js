import $ from 'jquery';
import 'bootstrap';

//require('../home.html');
import { auth, provider } from '../js/config/fb';

let paginaHome = "home.html";

/**
 * Criar um novo Usuario
 * @param {String} emailInput email do usuario
 * @param {String} senhaInput senha do usuario
 */
$("#createUserButton").click(e => {
    e.preventDefault();
    $("#mensagemView").empty();
    let emailInput = $('#emailInputCadastro').val();
    let senhaInput = $('#passwordInputCadastro').val();
    debugger;
    auth.createUserWithEmailAndPassword(emailInput, senhaInput)
        .then(function () {
            alert('Bem vindo ' + emailInput);
            window.location.href = paginaHome;
        }).catch(error => {
            console.log(error);
            $("#mensagemView").append(mensagemView("A senha deve ter pelo menos 6 caracteres"));
            $("#senhaIncorreta").modal();
        });
});

/**
 * Autenticar com E-mail e Senha
 * @param {String} emailInput email do usuario
 * @param {String} senhaInput senha do usuario
 */
$("#authEmailPassButton").click(e => {
    e.preventDefault();
    $("#mensagemView").empty();
    let emailInput = $('#emailInput').val();
    let senhaInput = $('#passwordInput').val();
    auth.signInWithEmailAndPassword(emailInput, senhaInput).then(result => {
        window.location.href = paginaHome;
    }).catch(error => {

        console.log(error.message);

        if (error.message == "The email address is badly formatted.") $("#mensagemView").append(mensagemView("O Formato do E-mail é inválida"));

        if (error.message == "The password is invalid or the user does not have a password.") $("#mensagemView").append(mensagemView("A senha é inválida ou o usuário não possui uma senha."));

        if (error.message == "There is no user record corresponding to this identifier. The user may have been deleted.") $("#mensagemView").append(mensagemView("Não há registro de usuário correspondente a esse identificador. O usuário pode ter sido excluído."));

        if (error.message == "Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later") $("#mensagemView").append(mensagemView("Tente novamente."));

        $("#senhaIncorreta").modal();
    });
});

/**
 * Logout
 */
$("#logOutButton").click(function () {
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
$("#authGoogleButton").click(function () {
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


function mensagemView(texto) {
    return `<p class="alert alert-dark">${texto} </p>`
}

$("#esqueciSenhaModal").click(function (e) {
    e.preventDefault();
    let emailAddress = $("#emailInputEsqueciSenha").val();
    auth.sendPasswordResetEmail(emailAddress).then(function () {
        $('#esqueciSenha').modal('hide');
        $("#mensagemView").append(mensagemView("Verifica seu E-mail."));
        $("#senhaIncorreta").modal();
    }).catch(function (error) {
        console.log(error);
        $('#esqueciSenha').modal('hide');
    });
});



