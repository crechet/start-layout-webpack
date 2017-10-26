// Import jQuery.
import $ from 'jquery/dist/jquery.min.js';

$('.click-test').click(() => {
    alert('It works! You can delete this in js/main.js');
});

(() => {
    console.log('Babel is ok!');
})();