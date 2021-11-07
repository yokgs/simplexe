let x = ['abcde','uvw','xyzt'];
let $ = {
    iterate: function (table) {
        if ($.hasNext(table)) {
            let k = table.length - 1;
            var min = Math.min(...table[k]);
            var en = table[k].indexOf(min),
                p = [];
            for (let i = 1; i < table.length - 1; i++) {
                let r = table[i].slice(0, table[0].length);
                let t = r[en] / r[r.length - 1];
                p = [...p, t];
            }
            var sr = p.indexOf(Math.min(...p)) + 1;
            var table_ = JSON.parse(JSON.stringify(table));
            for (let i = 1; i < table.length; i++) {
                for (let j = 1; j < table[0].length; j++) {
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
    heatMap: function (old, table) {
        return table;
    },
    valid: function (table) {
        return true;
    },
    duality: function (p) {
        
    },
    createTable: function (str) {
        var eq = str.trim().replace(/\|/g,'').replace(/[\n]+/g, ';').replace(/[;]+/g, ';').replace(/[\s]+/g, ' ');
        eq = eq.replace(/[\s]*\+[\s]*/g, ' + ').replace(/[\s]*\-[\s]*/g, ' - ')
            .replace(/[\s]*=[\s]*/g, ' = ')
            .replace(/[\s]*>[\s]*/g, ' > ').replace(/[\s]*<[\s]*/g, ' < ')
            .replace(/[\s]*>[\s]*=[\s]*/g, ' >= ').replace(/[\s]*<[\s]*=[\s]*/g, ' <= ').split(';');
        if (!/^m(in|ax) ([\w]+ =)*/.test(eq[0])) {
            return { type: 'error', content: '' };
        }
        for (let i in eq) {
            eq[i] = eq[i].replace(/ \+ /g, '||+').replace(/ \- /g, '||-')
                .replace(/ >= /g, '|||>=|||').replace(/ <= /g, '|||<=|||')
                .replace(/ > /g, '|||>|||').replace(/ < /g, '|||<|||')
                .replace(/ = /g, '|||=|||').split('|||').map(x => x.split('||').map(e => {
                    if (/^m(in|ax)/.test(e)||/^[<>=]+/.test(e)) return e;
                    if (!/^(\+|\-)/.test(e)) {
                        e = '+' + e;
                    }
                    if (!/^(\+|\-)[\d]+[\w]*/.test(e)) {
                        e = e.replace(/\+/, '+1').replace(/\-/, '-1');
                    }
                    return e;
                }));
        }
       
        let [op, res] = eq[0][0][0].split(' ');
        if (!res) res = '$P';

        console.log(res,op)
         return eq
        /*
        min p = 2y + 6x - z;    -2 -6  1  0  0
        x + y >= 0;              1  1  0 -1  0
        z + 6x < 10;             6  0  1  0  1

         */
    },

}
console.log($.createTable('max = 89v+7u;\n8v-r>=6'));