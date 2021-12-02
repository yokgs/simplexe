/**
 * Simplexe API
 * by Yazid Slila (@yokgs)
 * licensed under Apache 2.0
 */


// Utilities

let shape = function (v) {
        if (v instanceof Array)
            return [v.length, ...shape(v[v.length - 1])];
        else
            return [];
    },
    lastItem = function (v) {
        if (v instanceof Array)
            return clone(v[v.length - 1]);
    },
    arrayType = function (v, t) {
        var u = v.filter(x => (typeof x == t));
        return u.length == v.length;
    },
    same = function (a, b) {
        if (typeof a === typeof b) {
            if (a instanceof Array && b instanceof Array) {
                for (let i = 0; i < Math.min(a.length, b.length); i++) {
                    if (!same(a[i], b[i])) return false;
                }
                return true;
            } else
                return a == b;
        } else
            return false;
    },
    reshape = function (v, d) {
        while (shape(v)[0] < d) {
            v = [...v, zero(shape(lastItem(v)))];
        }
        return v.slice(0, d);
    },
    zero = function (s) {
        if (s.length == 0) return 0;
        else {
            var t = zero(s.slice(1)),
                z = [];
            for (let i = 0; i < s[0]; i++) {
                z = [...z, t];
            }
            return z;
        }
    },
    multiply = function (v, s) {
        if (shape(v).length == 1 && typeof s == 'number') {
            return v.map(x => (x * s));
        }
        return NaN;
    },
    heatMap = function (table) {
        let search = true;
        var main = lastItem(table);
        var minIn = main.slice(0, main.length - 1).sort((x, y) => (x - y)),
            i = 0,
            _in = NaN,
            _out = NaN;
        while (search && i < table.length - 1) {
            _in = main.indexOf(minIn[i]);
            var p = [];
            for (let j = 1; j < table.length - 1; j++) {
                let r = table[j];
                let t = r[r.length - 1] / r[_in] || Infinity;
                p = [...p, t];
            }
            var minOut = p.sort((x, y) => (x - y)).filter(x => (x >= 0)),
                j = 0;
            if (minOut.length > 0) search = false;
            else {
                i++;
                break;
            }
            _out = p.indexOf(minOut[j]) + 1;
        }
        return [_in, _out]
    },
    clone = function (n) {
        if (n instanceof Array) {
            let t = [];
            for (let i in n)
                t[i] = clone(n[i]);
            return t;
        }
        return n;
    };


// Simplexe

function simplexe(table) {
    this.tables = [];
    this.vectors = [];
    this.main = [];
    this.next = function () {
        if (this.tables.length == 0)
            this.reset();
        if (this.hasNext()) {
            var table = lastItem(this.tables);
            console.log(heatMap(table));
            var [_in, _out] = heatMap(table);
            //var main = lastItem(table);
            let Table = clone(table);
            for (let i = 0; i < table.length; i++) {
                for (let j = 0; j < table[0].length; j++) {
                    if (i == _out)
                        table[i][j] /= Table[i][_in];
                    else if (j == _in)
                        table[i][j] = 0;
                    else
                        table[i][j] -= Table[i][_in] / Table[_out][_in] * Table[_out][j];
                }
            }
            this.tables = [...this.tables, table];
        }
        return heatMap(lastItem(this.tables));
    };
    this.hasNext = function () {
        let i = lastItem(lastItem(this.tables));
        return Math.min(...i.slice(0, i.length - 1)) < 0;
    };
    this.reset = function () {
        this.tables = [];
        this.tables.push(clone(this.vectors));
        this.tables[0].push(reshape(multiply(this.main, -1), shape(this.vectors)[1]));
    }
    this.pushVector = function (vector) {
        if ((this.vectors.length > 0 && same(shape(vector), shape(lastItem(this.vectors)))) ||
            this.vectors.length == 0) {
            if (arrayType(vector, 'number') && vector.length > 1) {
                this.vectors.push(vector);
                this.reset();
                return true;
            }
        }
        return false;
    };
    this.mainVector = function (vector) {
        if (shape(vector).length == 1) {
            this.main = [...vector];
            this.reset();
            return true;
        }
        return false;
    };
    this.solve = function (max) {
        max = max || 10;
        while (max-- > 0 && this.hasNext())
            this.next();
        return this.tables.length;
    }
}
simplexe.formatSrting = function (string) {

}
simplexe.fromString = function (string) {

}
simplexe.duality = function (matrix) {

}
simplexe.genetic = function (equations) {
    this.generation = [];
    this.scores = [];
    this.eq = [
        [2, 4, '>', 7],
        [9, -7]
    ];
    this._config = {
        elitism: .2,
        mutationRate: .1,
        mutationRange: 5,
        generation: 20,
        order: 1,

    };
    this.initGen = function () {

    };
    this.nextGen = function () {

    };
    this.evaluate = function () {
        let main = lastItem(this.eq);
        this.scores = [];
        for (let i in this.generation) {
            var score = 0;
            for (let j in this.generation[i]) {
                if (j < main.length)
                    score += this.generation[i][j] * main[j];
                else
                    break;
            }
            this.scores[i] = score;
        }
    };
    this.config = function (c) {
        for (let i in c) {
            if ((i in this._config) && (typeof c[i] == typeof this._config[i]))
                this._config[i] = c[i];
        }
    }
}