class Builder {
    constructor(n) { !isNaN(n) ? this.variable = n : this.variable = 0 }
    plus(...n) {}
    minus(...n) {}
    multiply(n) {}
    divide(n) {}
    get() {}
}

class IntBuilder extends Builder {
    plus(...n) {
        let sum = this.get();
        n.forEach(num => sum += num);
        this.variable = sum;
        return this;
    }

    minus(...n) {
        let sum = this.get();
        n.forEach(num => sum -= num);
        this.variable = sum;
        return this;
    }

    multiply(n) {
        this.variable = this.get()*n;
        return this;
    }

    divide(n) {
        this.variable = this.get()/n;
        return this;
    }

    mod(n) {
        this.variable = this.get()%n;
        return this;
    }

    get() { return this.variable }

    static random(from, to) {
        return Math.floor((Math.random() * (to - from + 1)) + from);
    }
}

console.log(IntBuilder.random(10, 100))

let intBuilder = new IntBuilder(10);

console.log(intBuilder
    .plus(2, 3, 2)                     // 17;
    .minus(1, 2)                       // 14;
    .multiply(2)                       // 28;
    .divide(4)                         // 7;
    .mod(3)                            // 1;
    .get());                           // -> 1;  

//prints result after each function
/*

intBuilder.plus(2,3,2);
console.log(intBuilder.get());

intBuilder.minus(1, 2);
console.log(intBuilder.get());

intBuilder.multiply(2);
console.log(intBuilder.get());

intBuilder.divide(4);
console.log(intBuilder.get());

intBuilder.mod(3);
console.log(intBuilder.get());
*/