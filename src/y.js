var YUtil = {
    shape: function (v) {
        if (v instanceof Array)
            return [v.length, ...this.shape(v[v.length - 1])];
        else
            return [];
    },
    lastItem: function (v) {
        if (v instanceof Array)
            return this.clone(v[v.length - 1]);
    },
    arrayType: function (v, t) {
        var u = v.filter(x => (typeof x == t));
        return u.length == v.length;
    },
    same: function (a, b) {
        if (typeof a === typeof b) {
            if (a instanceof Array && b instanceof Array) {
                for (let i = 0; i < Math.min(a.length, b.length); i++) {
                    if (!this.same(a[i], b[i])) return false;
                }
                return true;
            } else
                return a == b;
        } else
            return false;
    },
    reshape: function (v, d) {
        while (this.shape(v)[0] < d) {
            v = [...v, this.zero(this.shape(this.lastItem(v)))];
        }
        return v.slice(0, d);
    },
    zero: function (s) {
        if (s.length == 0) return 0;
        else {
            var t = this.zero(s.slice(1)),
                z = [];
            for (let i = 0; i < s[0]; i++) {
                z = [...z, t];
            }
            return z;
        }
    },
    multiply: function (v, s) {
        if (this.shape(v).length == 1 && typeof s == 'number') {
            return v.map(x => (x * s));
        }
        return NaN;
    },
    heatMap: function (table) {
        let search = true;
        var main = this.lastItem(table);
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
    clone: function (n) {
        if (n instanceof Array) {
            let t = [];
            for (let i in n)
                t[i] = this.clone(n[i]);
            return t;
        }
        return n;
    },
    indexTop: function (vector) {
        let order = [];
        for (let j = 0; j < vector.length; j++) {
            let max = -Infinity,
                $max = NaN;
            for (let i in vector) {
                if ((!Number.isNaN(vector[i])) && (!order.includes(i)) && vector[i] >= max) {
                    max = vector[i];
                    $max = i;
                }
            }
            if (!Number.isNaN($max)) order.push($max);
        }
        let i = 0;
        while (order.length < vector.length) {
            if (!order.includes(i)) order.push(i);
            i++;
        }
        return order;
    },
    calculate: function (a, b, f) {
        if (a instanceof Array) {
            if (b instanceof Array) {
                if (this.shape(a)[0] == this.shape(b)[0]) {
                    let A = [];
                    for (let i = 0; i < a.length; i++)
                        A[i] = this.calculate(a[i], b[i], f);
                    return A;
                }
            } else if (typeof b == 'number') {
                let A = [];
                for (let i = 0; i < a.length; i++)
                    A[i] = this.calculate(a[i], b, f);
                return A;
            } else {
                throw new Error(typeof b + ' cannot be used in calculate()');
            }
        } else if (typeof a == 'number') {
            if (b instanceof Array)
                return this.calculate(b, a, (x, y) => f(y, x));
            else if (typeof b == 'number')
                return f(a, b);
        } else
            throw new Error(typeof a + ' cannot be used in calculate()');
        return NaN;
    },
    mean: function (vect) {
        let m = this.zero(this.shape(this.lastItem(vect)));
        for (let i = 0; i < vect.length; i++)
            m = this.calculate(m, vect[i], (x, y) => (x + y));
        return this.calculate(m, vect.length, (x, y) => (x / y));
    },
    variance: function (vect) {
        let m = this.mean(vect),
            v = [];
        for (let i = 0; i < vect.length; i++)
            v[i] = this.calculate(m, vect[i], (x, y) => Math.pow(y - x, 2));
        return v.map(x => {
            if (Number.isNaN(x)) return 0;
            return x;
        }).reduce((x, y) => (x + y), 0) / v.length;
    },
    compare: function (a, o, b) {
        switch (o) {
            case '>':
                return a > b;
            case '=':
                return a == b;
            case '<':
                return a < b;
            case '>=':
                return a >= b;
            case '<=':
                return a <= b;
        }
        return false;
    }
};