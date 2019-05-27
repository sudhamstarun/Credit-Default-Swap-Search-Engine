/* Set Progress | jQuery
======================================*/
/*
$(document).ready(function(){
	var max = 150.72259521484375;
	$.each($('.progress'), function( index, value ){
		percent = $(value).data('progress');
		$(value).children($('.fill')).attr('style', 'stroke-dashoffset: ' + ((100 - percent) / 100) * max);
		$(value).children($('.value')).text(percent + '%');
	});
});
*/


var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
    }
};
window.onload = function () {
    var max = -219.99078369140625;
    forEach(document.querySelectorAll('.progress'), function (index, value) {
        percent = value.getAttribute('data-progress');
        value.querySelector('.fill').setAttribute('style', 'stroke-dashoffset: ' + ((100 - percent) / 100) * max);
        value.querySelector('.value').innerHTML = percent + '%';
    });
}



/*

Used to calc the variable 'max'
and set 'stroke-dasharray' and
'stroke-dashoffset' in the css


  	console.log(document.querySelector('.fill').getTotalLength());

*/
