export class Colaborador {

    constructor(uid, verfica) {      
        this[uid] = verfica;
        Object.freeze(this);
    }

    get uid() {        
        return this._uid;
    }
    
    get nome() {        
        return this._nome;
    }

    get nick() {        
        return this._nick;
    }

    get email() {        
        return this._email;
    }

    get senha() {        
        return this._senha;
    }
}