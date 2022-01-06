let YMath = {
    parse: function (string) {
        let code = string;
        return code;
    },
    highlight: function (string) {

    },
    format: function (string) {
        return string.trim().replace(/\|/g, '').replace(/[\n]+/g, ';')
            .replace(/[;]+/g, ';').replace(/[\s]+/g, ' ')
            .replace(/[\s]*\+[\s]*/g, ' + ').replace(/[\s]*\-[\s]*/g, ' - ')
            .replace(/[\s]*=[\s]*/g, ' = ')
            .replace(/[\s]*>[\s]*/g, ' > ').replace(/[\s]*<[\s]*/g, ' < ')
            .replace(/[\s]*>[\s]*=[\s]*/g, ' >= ').replace(/[\s]*<[\s]*=[\s]*/g, ' <= ')
            .replace(/;/g, '\n').replace(/&/g, '').replace(/#[\s]*/g, '# ');
    }
}