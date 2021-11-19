let x = ['abcdefghijklmnopxyz'];
let empty = n => {
    var t = [];
    for (let i = 0; i < n; i++)
        t.push(0)
    return t;
}
let $ = {
    iterate: function (table$) {
        var table = $.clone(table$);
        if ($.hasNext(table)) {
            var [en, sr] = $.heatMap(table);
            var table_ = $.clone(table);
            for (let i = 1; i < table.length; i++) {
                for (let j = 0; j < table[0].length; j++) {
                    if (i == sr) {
                        table[i][j] /= table_[i][en];
                    } else if (j == en) {
                        table[i][j] = 0;
                    } else {
                        table[i][j] -= table_[i][en] / table_[sr][en] * table_[sr][j];
                    }
                }
            }
        }
        return table;
    },
    hasNext: function (table) {
        let k = table.length - 1;
        return $.valid(table) && Math.min(...table[k]) < 0;
    },
    heatMap: function (table) {
        if ($.hasNext(table)) {
            let k = table.length - 1;
            var min = Math.min(...table[k]);
            var en = table[k].indexOf(min),
                p = [];
            for (let i = 1; i < table.length - 1; i++) {
                let r = table[i].slice(0, table[0].length);
                let t = Math.abs(r[r.length - 1] / r[en]) || Infinity;
                p = [...p, t];
            }
            var sr = p.indexOf(Math.min(...p)) + 1;
            return [en, sr];
        }
        return [NaN, NaN]

    },
    valid: function (table) {
        return true;
    },
    /*complete: function (eq) {
        for (let i in eq ){
            var t = eq[i];
            if ([">=","<=",">","<","="].includes(t[0])) {
                G[];
            }
        }
    },*/
    duality: function (table) {
        var l = table.length - 2,
            resEq = [...table[l - 1]],
            labels = [...table[0]];
        var nLabels = $.generate(labels, l);


    },
    generate: function (old, size) {
        var r_ = 'abcdefghijklmnopqrstuvwyz',
            ens = [];
        var r = [...r_, ...r_.toUpperCase()];
        for (let i of r) {
            if (!old.includes(i))
                ens.push(i);
        }
        /*if (ens.length < size) {
            var C = ens[Math.floor(Math.random() * ens.length)].toUpperCase();
            ens=r.map(x=>(C+x))
        }*/
        var v = ens[Math.floor(Math.random() * ens.length)],
            t = [];
        for (let i = 0; i < size; i++) {
            t.push(v + (i + 1));
        }
        return t
    },
    format: function (str) {
        var eq = str.trim().replace(/\|/g, '').replace(/[\n]+/g, ';').replace(/[;]+/g, ';').replace(/[\s]+/g, ' ');
        eq = eq.replace(/[\s]*\+[\s]*/g, ' + ').replace(/[\s]*\-[\s]*/g, ' - ')
            .replace(/[\s]*=[\s]*/g, ' = ')
            .replace(/[\s]*>[\s]*/g, ' > ').replace(/[\s]*<[\s]*/g, ' < ')
            .replace(/[\s]*>[\s]*=[\s]*/g, ' >= ').replace(/[\s]*<[\s]*=[\s]*/g, ' <= ').replace(/;/g, '\n');
        return eq;
    },
    createTable: function (str) {
        var eq = $.format(str).split('\n');
        if (!/^m(in|ax) ([\w]+ =)*/.test(eq[0])) {
            return {
                type: 'error',
                content: ''
            };
        }
        for (let i in eq) {
            eq[i] = eq[i].replace(/ \+ /g, '||+').replace(/ \- /g, '||-')
                .replace(/ >= /g, '|||>=|||').replace(/ <= /g, '|||<=|||')
                .replace(/ > /g, '|||>|||').replace(/ < /g, '|||<|||')
                .replace(/ = /g, '|||=|||').split('|||').map(x => x.split('||').map(e => {
                    if (/^m(in|ax)/.test(e) || /^[<>=]+/.test(e)) return e;
                    if (!/^(\+|\-)/.test(e))
                        e = '+' + e;
                    if (!/^(\+|\-)[\d]+[\w]*/.test(e))
                        e = e.replace(/\+/, '+1').replace(/\-/, '-1');
                    return e;
                }));
        }
        /*if (op == "min") {
            eq = $.duality(eq);
        }*/
        let [op, res] = eq[0][0][0].split(' ');
        if (!res) res = '$P';
        let tab = [],
            tabx = {},
            ii = 1;
        for (let i in eq) {
            if (i == 0) {
                for (let j in eq[0][2]) {
                    var n = eq[0][2][j];
                    var k = n.match(/^(\+|\-)[\d\.\,]+/i)[0].length;
                    var $var = n.substring(k, n.length);
                    if (!($var in tabx)) tabx[$var] = 0;
                    tabx[$var] += Number(n.replace(/,/g, '.').substr(0, k));
                }
            } else {
                var com = eq[i][1][0];
                if (['<', '<=', '>=', '>'].includes(com)) {
                    var extra = (com == '>=' || com == '>' ? '-' : '+') + '1X' + ii;
                    eq[i][0].push(extra);
                    ii++;
                }
                tab[i - 1] = {};
                for (let j in eq[i][0]) {
                    var n = eq[i][0][j];
                    var k = n.match(/^(\+|\-)[\d\.\,]+/i)[0].length;
                    var $var = n.substring(k, n.length);
                    if (!($var in tab[i - 1])) tab[i - 1][$var] = 0;
                    if (!($var in tabx)) tabx[$var] = 0;
                    tab[i - 1][$var] += Number(n.replace(/,/g, '.').substr(0, k));
                }
                tab[i - 1][res] = Number(eq[i][2][0]);
            }
        }
        tabx[res] = 0;
        var table = [
                []
            ],
            ind = {};
        for (let i in tabx) {
            ind[i] = table[0].length;
            table[0].push(i);
        }
        for (let i in tab) {
            var L = empty(table[0].length);
            for (let j in tab[i]) {
                L[ind[j]] = tab[i][j];
            }
            table.push(L);
        }
        var L = []
        for (let i in tabx) {
            L[ind[i]] = tabx[i] == 0 ? 0 : tabx[i] * -1;
        }
        table.push(L);
        return table;
    },
    data2html: function (tab, t, prec) {
        var [en, sr] = t;
        return '<table>' + tab.map((x, i) => ('<tr' + (i == sr ? ' class="v-input"' : '') + '>' + x.map((t, j) => ('<td width="' + (100 / x.length) + '%"' + (j == en ? ' class="input"' : '') + '>' + (typeof t == 'number' ? Number(t.toFixed(prec)) : $.indexHTML(t)) + '</td>')).join('') + '</tr>')).join('') + '</table>'
    },
    indexHTML: function (s) {
        var v = (s.match(/^[a-zA-Z]+/) || [''])[0];
        var i = s.replace(v, '');
        return v + '<sub>' + i + '</sub>'
    },
    clone: x => JSON.parse(JSON.stringify(x)),
}

function display(table) {
    var body = document.body;
    body.innerHTML = data2html(table);
    while ($.hasNext(table)) {
        table = $.iterate(table);
        body.innerHTML += data2html(table);
    }
}
//display($.createTable('max P = x + y;x + y <= 30;y <= 10'));//'max G=4470B+2316O+2650M;B+O+M<=1000;8B+8B+9M<=8750;9B+6O+45M<=16000'));
//console.log($.iterate($.createTable('max G=4470B+2316O+2650M;B+O+M<=1000;8B+8B+9M<=8750;9B+6O+45M<=16000')))