let covariance = function (v, w) {
    let m = YUtil.mean(v),
        n = YUtil.mean(w),
        V = [],
        s = Math.min(v.length, w.length);
    for (let i = 0; i < s; i++)
        V[i] = (v[i] - m) * (w[i] - n);
    return V.reduce((x, y) => (x + y), 0) / s;
};

var esm = function (m) {
    this.table = YUtil.clone(m);
    this.correlation = function (a, b) {
        let sga = Math.sqrt(YUtil.variance(this.table[a])),
            sgb = Math.sqrt(YUtil.variance(this.table[b])),
            cov = covariance(this.table[a], this.table[b]);
        return cov / (sga * sgb);
    }
    this.map = function () {
        let t = [];
        for (let i = 0; i < m.length; i++){
            t[i] = [];
            for (let j = 0; j < m.length; j++){
                t[i][j] = this.correlation(i, j);
            }
        }
        return t;
    }
    this.line = function (a, b) {
        let A = covariance(this.table[a], this.table[b]) / variance(this.table[a]);
        let B = mean(this.table[b]) - A * mean(this.table[a]);
        return [A, B];
    }
    this.farsestPoint = function (a, b) {
        let [A, B] = this.line(a, b),
            k = this.table[b].map((x, i) => {
                return Math.abs(x - A * this.table[a][i] + B);
            });
        return k.indexOf(Math.max(...k));
    }
    this.estimate = function (a, b, c) {
        let [x, y] = this.line(a, b);
        return x * c + y;
    }

}