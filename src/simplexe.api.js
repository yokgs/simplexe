/**
 * Simplexe API
 * by Yazid Slila (@yokgs)
 * licensed under Apache 2.0
 */

function simplexe(table) {
    this.tables = [];
    this.vectors = [];
    this.main = [];
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
                en = main.indexOf(minIn[i]);
                var p = [];
                for (let i = 1; i < table.length - 1; i++) {
                    let r = table[i];
                    let t = r[r.length - 1] / r[en] || Infinity;
                    p = [...p, t];
                }
                var minOut = p.sort((x, y) => (x - y)).filter(x => (x >= 0)),
                    j = 0;
                if (minOut.length > 0) search = false;
                else {
                    i++;
                    break;
                }
                sr = p.indexOf(minOut[j]) + 1;
            }
            return [_in, _out]
        },
        clone = function (n) {
            return JSON.parse(JSON.stringify(n));
        };
    this.next = function () {
        if (this.tables.length == 0)
            this.reset();
        if (this.hasNext()) {
            var table = lastItem(clone(this.tables));
            var [_in, _out] = heatMap(table);
            //var main = lastItem(table);
            let Table = clone(table);
            for (let i = 1; i < table.length; i++) {
                for (let j = 0; j < table[0].length; j++) {
                    if (i == sr)
                        table[i][j] /= Table[i][en];
                    else if (j == en)
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
        let i = lastItem(this.tables);
        return Math.min(...i.slice(0, i.length - 1)) < 0
    };
    this.reset = function () {
        this.tables = [];
        this.tables.push(this.vectors);
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
}
simplexe.formatSrting = function (string) {

}
simplexe.fromString = function (string) {

}
simplexe.duality = function (matrix) {

}
var t = new simplexe();
console.log(t.pushVector([6, 8, 0]));
console.log(t.pushVector([6, 9, 8]));
console.log(t.mainVector([7, 9]));
console.log(t.next());
console.log(t.tables);
console.log('t.tables');
console.log(t.vectors);