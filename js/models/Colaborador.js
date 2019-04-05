export class Colaborador {

    constructor(uid, verfica) {      
        this[uid] = verfica;
        Object.freeze(this);
    }
    
    
    // constructor(nome, nick, email, senha) {      
    //     this._nome = nome;
    //     this._nick = nick;
    //     this._email = email;
    //     this._senha = senha;
    //     Object.freeze(this);
    // }

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