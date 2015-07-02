/**
 * Created by shusa000 on 6/29/2015.
 */
"use strict";


var getLoader = (

    function () {
    var counter = 0;
    return function () {return counter += 1;}
})();