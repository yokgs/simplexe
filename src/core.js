let empty = n => {
    var t = [];
    for (let i = 0; i < n; i++)
        t.push(0)
    return t;
}
let $ = {
    iterate: function (table) {
        var table2 = $.clone(table);
        if ($.hasNext(table2)) {
            var [en, sr] = $.heatMap(table2);
            var table = $.clone(table2);
            for (let i = 1; i < table2.length; i++) {
                for (let j = 0; j < table2[0].length; j++) {
                    if (i == sr)
                        table2[i][j] /= table[i][en];
                    else if (j == en)
                        table2[i][j] = 0;
                    else
                        table2[i][j] -= table[i][en] / table[sr][en] * table[sr][j];
                }
            }
        }
        return table2;
    },
    hasNext: function (table) {
        let k = table.length - 1;
        let [en, sr] = $.heatMap(table);
        return (!Number.isNaN(en) && !Number.isNaN(sr)) && Math.min(...table[k].slice(0, table[k].length - 1)) < 0;
    },
    heatMap: function (table) {
        let k = table.length - 1,
            search = true;
        var min = table[k].slice(0, table[k].length - 1).filter(x => (x < 0)).sort((x, y) => (x - y)),
            i = 0,
            en = NaN,
            sr = NaN;
        while (search && i < min.length) {
            en = table[k].indexOf(min[i]);
            var p = [];
            for (let j = 1; j < table.length - 1; j++) {
                let r = table[j].slice(0, table[0].length);
                let t = r[r.length - 1] / r[en] || Infinity;
                p = [...p, t];
            }
            var min$ = [...p].sort((x, y) => (x - y)).filter(x => (x >= 0));
            if (min$.length > 0) search = false;
            else {
                i++;
                break;
            }
            sr = p.indexOf(min$[0]) + 1;
        }
        if (Number.isNaN(en) || Number.isNaN(sr))
            return [NaN, NaN];
        return [en, sr];
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
        let [_, res] = table[0][0][0].split(' ');
        let list = ["number"],
            table2 = [],
            op = [];
        for (let i = 0; i < table.length; i++) {
            let ls = table[i][0],
                b = table[i][2];
            let subtable = [];
            if (!/^min/.test(ls)) {
                ls.forEach(x => {
                    var [nom, valeur] = $.NumberConverter(x);
                    if (!list.includes(nom)) list.push(nom);
                    if (typeof subtable[list.indexOf(nom)] != 'number') subtable[list.indexOf(nom)] = 0;
                    subtable[list.indexOf(nom)] += valeur;
                });
            }
            b.forEach(x => {
                var [nom, valeur] = $.NumberConverter(x);
                if (!list.includes(nom)) list.push(nom);
                if (typeof subtable[list.indexOf(nom)] != 'number') subtable[list.indexOf(nom)] = 0;
                subtable[list.indexOf(nom)] -= valeur;
            });
            table2.push(subtable);
            op.push(...table[i][1]);
        }
        table2.map(x => {
            for (let i = 0; i < x.length; i++)
                x[i] = typeof x[i] == 'number' ? x[i] : 0;
            return x;
        });
        largerow = Math.max(...table2.map(x => x.length));
        table2.map(x => {
            while (x.length < largerow)
                x.push(0);
            return x;
        });
        finalTab = [
            [...list, '%operator%']
        ];
        for (let i = 0; i < table2.length; i++) {
            finalTab.push([...table2[i], op[i]]);
        }

        varPrefix = 'UXVYZLHRQ'.split('').filter(x => !list.includes(x))[0];
        let dual = [];
        dual[0] = [];
        for (let k = 1; k < finalTab.length - 1; k++)
            dual[0][k] = varPrefix + k;
        for (let i = 0; i < finalTab[0].length - 1; i++) {
            dual[i + 1] = [];
            for (let k = 1; k < finalTab.length; k++) {
                let n = finalTab[k][finalTab[k].length - 1];
                dual[i + 1][k - 1] = finalTab[k][i] * (n == "<" || n == "<=" && k > 1 ? -1 : 1);
            }
        }
        extra = [
            []
        ];
        for (let i = 0; i < dual.length - 1; i++) {
            extra[i + 1] = [];
            for (let j = 0; j < dual.length - 2; j++) {
                if (i == 0)
                    extra[0][j] = `A${j + 1}`;
                extra[i + 1][j] = i == j ? 1 : 0;
            }
        }

        let dual2 = $.clone(dual);
        for (let i = 2; i < dual2.length; i++) {
            dual2[i - 1] = dual2[i];
        }
        dual2[dual2.length - 1] = [...dual[1]];
        extra.map((x, i) => {
            dual2[i].push(...x);
        });
        dual2[0][0] = res;
        dual2.forEach(x => {
            let tmp = typeof x[0] == 'number' ? x[0] * -1 : x[0];
            for (let i = 1; i < x.length; i++) {
                x[i - 1] = x[i];
            }
            x[x.length - 1] = tmp;
        })
        return dual2;
    },
    NumberConverter: function (number) {
        var k = number.match(/^(\+|\-)[\d\.\,]+/i)[0].length;
        var nom = number.substring(k, number.length).trim(),
            valeur = Number(number.replace(/,/g, '.').substr(0, k));
        if (nom == "") nom = "number";
        return [nom, valeur];
    },
    format: function (str) {
        var eq = str.trim().replace(/\|/g, '').replace(/[\n]+/g, ';').replace(/[;]+/g, ';').replace(/[\s]+/g, ' ');
        eq = eq.replace(/[\s]*\+[\s]*/g, ' + ').replace(/[\s]*\-[\s]*/g, ' - ')
            .replace(/[\s]*=[\s]*/g, ' = ')
            .replace(/[\s]*>[\s]*/g, ' > ').replace(/[\s]*<[\s]*/g, ' < ')
            .replace(/[\s]*>[\s]*=[\s]*/g, ' >= ').replace(/[\s]*<[\s]*=[\s]*/g, ' <= ').replace(/;/g, '\n').replace(/###/g, '').replace(/#[\s]*/g, '# ');
        return eq;
    },
    createTable: function (str) {
        var eq = $.format(str).split('\n');
        if (!/^m(in|ax) ([\w]+ )*=/.test(eq[0])) {
            return {
                type: 'error'
            };
        }
        eq = eq.filter(x => !x.startsWith('# '));

        for (let i in eq) {
            eq[i] = eq[i].replace(/#.*/g, '').replace(/ \+ /g, '||+').replace(/ \- /g, '||-')
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
        let [op, res] = eq[0][0][0].split(' '); // op = { max | min } res = l'equation objective
        if (op == "min")
            return $.duality($.clone(eq));
        if (!res) res = 'P';
        let tab = [],
            tabx = {},
            ii = 1;
        for (let i in eq) {
            if (i == 0) {
                for (let j in eq[0][2]) {
                    let [$var, valeur] = $.NumberConverter(eq[0][2][j])
                    if (!($var in tabx)) tabx[$var] = 0;
                    tabx[$var] += valeur;
                }
            } else {
                var com = eq[i][1][0];
                if (['<', '<=', '>=', '>'].includes(com)) {
                    var extra = (com == '>=' || com == '>' ? '-' : '+') + '1A' + ii;
                    eq[i][0].push(extra);
                    ii++;
                }
                tab[i - 1] = {};
                for (let j in eq[i][0]) {
                    let [$var, valeur] = $.NumberConverter(eq[i][0][j]);
                    if (!($var in tab[i - 1])) tab[i - 1][$var] = 0;
                    if (!($var in tabx)) tabx[$var] = 0;
                    tab[i - 1][$var] += valeur;
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
        try {
            var v = (s.match(/^[a-zA-Z]+/) || [''])[0];
            var i = s.replace(v, '');
            return v + '<sub>' + i + '</sub>'
        } catch (_) {}
        return s + '';
    },
    highlighter: function (code) {
        code = code.replace(/^min /, '@@').replace(/^max /, '!@');
        var comments = code.match(/#[\w=%()\+\- \.\,@!]*(?=(\n|$))/g);
        for (let i in comments) {
            code = code.replace(comments[i], '&&&');
        }
        if (/[a-zA-Z]+[\w]*/.test(code)) {
            var m = [...new Set(code.match(/[a-zA-Z]+[\w]*/g))].sort((x, y) => y.length - x.length);
            for (let i in m) {
                if (m[i] != 'min' && m[i] != 'max') {
                    code = code.replace(new RegExp(m[i], 'g'), '%%' + m[i] + '%#')
                        .replace(new RegExp('(?<=\d)' + m[i], 'g'), '%%' + m[i] + '%#')
                }
            }
        }
        code = code.replace(/%%/g, '<span class="variable">').replace(/%#/g, '</span>').replace('@@', 'min ').replace('!@', 'max ');
        var t = code.replace(/^max /g, '<span class="keyword">max</span> ').replace(/ >= /g, ' <span class="operator">>=</span> ').replace(/ > /g, ' <span class="operator">></span> ').replace(/ < /g, ' <span class="operator"><</span> ').replace(/ <= /g, ' <span class="operator"><=</span> ')
            .replace(/ = /g, ' <span class="operator">=</span> ').replace(/ \+ /g, ' <span class="operator">+</span> ').replace(/ \- /g, ' <span class="operator">-</span> ');
        let i = 0;
        while (/&&&/.test(t))
            t = t.replace('&&&', '<span class="comment">' + comments[i++] + '</span>');
        return t;
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