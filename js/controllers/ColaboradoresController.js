import {db} from '../config/fb';

import {Controller} from '../controllers/Controller';

export class ColaboradoresController extends Controller  {
    constructor() {        
        super();
    }

    onUserLogged() {
        this._init();
    }

    _init() {
        let colaboradores = {
            uid: this.user.id,
            email: this.user.email,
        }
        db.child(`usuario/${this.user.id}`).set(colaboradores).then(snapshot => {
            console.log("Colecao Usuario");
        });
    }

    procuraPorEmail(email){
        var email = "felipe@gmail.com";
        db.child(`usuario`).orderByChild('email').equalTo(email).on('value', snapshot => {
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