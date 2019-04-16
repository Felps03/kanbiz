import {db} from '../config/fb';

import {Controller} from './Controller';

export class ColaboradorController extends Controller  {
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
            // console.log("Colecao Usuario");
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