export class ColaboradoresController {

    constructor() {        
        let $ = document.querySelector.bind(document);
        this._inputNome = $('#nome');
        this._init();

    }

    _init() {
        firebase.auth().onAuthStateChanged((user) => {
            var colaboradores = {
                uid: user.uid,
                email: user.email,
            }
            ref.child(`usuario/${user.uid}`).set(colaboradores).then(snapshot => {
                console.log("Colecao Usuario");
            });
        });
    }

    procuraPorEmail(email){
        var email = "felipe@gmail.com";
        ref.child(`usuario`).orderByChild('email').equalTo(email).on('value', snapshot => {
            console.log(snapshot.exists());
            if(snapshot.exists()) {
                return snapshot.key;
            } else { 
                alert('nao achou');
            }
        });
    }

    adiciona(event) {        
        event.preventDefault();
                
        this._limpaFormulario();   
    }

    _limpaFormulario() {
     
        this._inputNome.value = '';
        
        
        this._inputNome.focus();   
    }

}