/**
 * Simplexe API
 * by Yazid Slila (@yokgs)
 * licensed under Apache 2.0
 */

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
                for (let j = 0; j < table[i].length; j++) {
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