function Builder(variable) {
    typeof variable === 'undefined' ? this.variable = '' : this.variable = variable
}

Builder.prototype.get = function() { return this.variable }
Builder.prototype.plus = function(n) {}
Builder.prototype.minus = function(n) {}
Builder.prototype.multiply = function(n) {}
Builder.prototype.divide = function(n) {}

function StringBuilder(variable) {
    Builder.call(this, variable);
}

StringBuilder.prototype = Object.create(Builder.prototype)
StringBuilder.prototype.constructor = StringBuilder

StringBuilder.prototype.plus = function(n) {
        var finalStr = this.get();
        for(var i = 0; i < n.length; i++) {
            finalStr += n[i];
        }
        this.variable = finalStr;
        return this;
}

StringBuilder.prototype.minus = function(n) {
        this.variable = this.variable.slice(0, -n + 1);
        return this;
}

StringBuilder.prototype.multiply = function(n) {
    var finalStr = '';

    for(var i = 0; i < n; i++) {
        finalStr += this.get();
    }
    
    this.variable = finalStr;
    return this;
}

StringBuilder.prototype.divide = function(n) {
    this.variable = this.get().substring(0, Math.floor(this.get().length / n));
    return this;
}


StringBuilder.prototype.remove = function(str) {
    while(this.get().includes(str)) {
        var k = this.get().indexOf(str);
        this.variable = this.get().slice(0, k) + this.get().slice(k + str.length, this.get().length - 1);
        return this;
    }   
}

StringBuilder.prototype.sub = function(from, n) {
    this.variable = this.get().slice(from, from + n);
    return this;
}

var stringBuilder = new StringBuilder('Hello');


/*
console.log(stringBuilder
    .plus([' all', '!'])                         // 'Hello all!'
    .minus(4)                                  // 'Hello '
    .multiply(3)                               // 'Hello Hello Hello '
    .divide(4)                                 // 'Hell';
    .remove('l')                               // 'He';
    .sub(1,1)                                  // 'e';
    .get());                                   // -> 'e';
*/

//prints restult after each function
///*
console.log(stringBuilder.get());

stringBuilder.plus(' all', '!');
console.log(stringBuilder.get());

stringBuilder.minus(4);
console.log(stringBuilder.get());

stringBuilder.multiply(3);
console.log(stringBuilder.get());

stringBuilder.divide(4);
console.log(stringBuilder.get());

stringBuilder.remove('l');
console.log(stringBuilder.get());

stringBuilder.sub(1,1);
console.log(stringBuilder.get());
//*/