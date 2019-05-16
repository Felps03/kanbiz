export function truncar(texto,limite){
    if(texto.length>limite){ 
        limite--;
        let last = texto.substr(limite-1,1);
        while(last!=' ' && limite > 0){
            limite--;
            last = texto.substr(limite-1,1);
        }
        last = texto.substr(limite-2,1);
        if(last == ',' || last == ';'  || last == ':'){
             texto = texto.substr(0,limite-2) + '...';
        } else if(last == '.' || last == '?' || last == '!'){
             texto = texto.substr(0,limite-1);
        } else {
             texto = texto.substr(0,limite-1) + '...';
        }
    }
    return texto;
}

export function sanitizeString(s,n){
	var res = s.split('', n).join('')	
  return res + '...';
}