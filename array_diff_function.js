Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Usage:
['show platform', 'show version', 'show diag detail', 'show sdr detail'].diff(['show platform', 'show version', 'show diag detail'])

>>> Array [ "show sdr detail" ]


function arr_diff (a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
    for (var k in a) {
        diff.push(k);
    }
    return diff;

Usage:
console.log(arr_diff(['show platform', 'show version', 'show diag detail', 'show sdr detail'], ['show platform', 'show version', 'show diag detail']))

>>> Array [ "show sdr detail" ]  
