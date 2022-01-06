simplexe.genetic = function (equations) {
    this.generation = [];
    this.scores = [];
    this.eq = [
        [2, 4, '>', 70],
        [9, -7]
    ];
    this._config = {
        elitism: .2,
        mutationRate: .1,
        mutationRange: 5,
        population: 20,
        order: 1,
        newGen: .2
    };
    this.initGen = function () {
        this.generation = [];
        while (this.generation.length < this._config.population) {
            var vect = [];
            for (let j = 0; j < lastItem(this.eq).length; j++) {
                vect[j] = Math.round(Math.random() * 2) - 1;
            }
            if (this.validGenom(vect))
                this.generation.push(vect);
        }
        return this;
    };
    this.nextGen = function () {
        this.evaluate();
        var gen = indexTop(this.scores);
        var backup = clone(this.generation);
        this.generation = [];
        for (let i = 0; i < (this._config.population * this._config.elitism); i++) {
            this.generation.push(backup[gen[i]]);
        }
        for (let i = 0; i < this._config.population * this._config.newGen; i++) {
            var vect = [],
                m = mean(backup),
                v = Math.sqrt(variance(backup));
            for (let j = 0; j < lastItem(this.eq).length; j++)
                vect[j] = Math.floor(Math.random() * v[j]) + m[j];
            this.generation.push(vect);
        }
        while (this.generation.length < this._config.population) {
            let genome = [];
            for (let i = 0; i < this.generation[0].length; i++) {
                let match = Math.random() / 2 + .25;
                genome[i] = Math.round(match * this.generation[0][i] + (1 - match) * this.generation[1][i]);
                if (Math.random() < this._config.mutationRate) {
                    genome[i] += Math.floor((Math.random() * 2 - 1) * this._config.mutationRange);
                }
            }
            this.generation.push(genome);
        }
        return this.generation;
    };
    this.evaluate = function () {
        let main = lastItem(this.eq),
            v = this.valid();
        this.scores = [];
        for (let i in this.generation) {
            var score = 0;
            for (let j in this.generation[i]) {
                if (j < main.length)
                    score += this.generation[i][j] * main[j];
                else
                    break;
            }
            this.scores[i] = v[i] ? score : NaN;
        }
    };
    this.valid = function () {
        return this.generation.map(x => this.validGenom(x));
    };
    this.validGenom = function (g) {
        for (let j = 0; j < this.eq.length - 1; j++) {
            let k, exp = 0;
            for (k = 0; k < this.eq[j].length - 1; k++) {
                if (typeof this.eq[j][k] == 'number')
                    exp += this.eq[j][k] * g[k];
                else break;
            }
            if (!compare(exp, this.eq[j][k++], this.eq[j][k]))
                return false;
        }
        return true;
    }
    this.config = function (c) {
        for (let i in c) {
            if ((i in this._config) && (typeof c[i] == typeof this._config[i]))
                this._config[i] = c[i];
        }
    }
}
var t = new simplexe.genetic();
t.initGen();
setInterval(() => {
    console.log(mean(t.generation), mean(variance(t.generation)))
    var y = t.generation[indexTop(t.scores)[0]];
    console.log(y ? y[0] * 2 + y[1] * 4 : 0, t.scores[indexTop(t.scores)[0]]);
    t.nextGen();
}, 1000);