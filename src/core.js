let x = 0;
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
    createTable: function (string) {

    },

}