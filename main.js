import $ from 'jquery';

import {db, auth, provider} from './fb.js';


// $( document ).ready(function() {
    db.child(`usuario`).on('value', snapshot => { 
        console.log(snapshot.val());
    });


    
// });