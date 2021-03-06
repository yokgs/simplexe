let Defaults = {
        code: "max G = 4470B + 2316O + 2650M;B + O + M <= 1000;8B + 8O + 9M <= 8750;9B + 6O + 45M <= 16000",
        cache: [],
        table: [],
        tab: [],
        i: 0,
        alpha: '',
        Error: '',
        OK: true,
        menu: false,
        epsilon: 4,
        theme: 'solarized',
        fontSize: 'normal',
        solution: '',
        version: '1.0.1',
        highlighted:true
    },
    data = Lockr.get('YS-CACHE', Defaults);
for (let i in Defaults) {
    if (!(i in data))
        data[i] = Defaults[i];
}

let app = {
    data() {
        return data;
    },
    methods: {
        refresh() {
            this.epsilon = Math.max(Math.min(this.epsilon, 10), 0);
            if (this.code.trim() == '') {
                this.Error = 'Empty Table';
                this.OK = false;
                return 0;
            }
            this.table = [];
            var tab = $.createTable(this.code);
            if ('type' in tab) {
                this.Error = 'Syntaxe Error';
                this.OK = false;
            } else {
                this.OK = true;
                this.table.push($.data2html(tab, $.heatMap(tab), this.epsilon));
                while ($.hasNext(tab) && this.table.length <= 20) {
                    tab = $.iterate(tab);
                    this.table.push($.data2html(tab, $.heatMap(tab), this.epsilon));
                }
                this.solution = tab[0][tab[0].length - 1] + '* = ' + tab[tab.length - 1][tab[tab.length - 1].length - 1];
                if (this.table.length > 20) {
                    this.Error = 'Long term process. please double check your equations';
                    this.OK = false;
                }
            }
            this.i = 0;
            this.save();
        },
        next() {
            if (this.i < this.table.length - 1)
                this.i++;
        },
        prev() {
            if (this.i > 0)
                this.i--;
        },
        format() {
            this.code = $.format(this.code);
            this.save();
        },
        toggleMenu() {
            this.menu = !this.menu;
        },
        save() {
            let newData = {};
            for (let i in Defaults) newData[i] = this[i];
            Lockr.set('YS-CACHE', newData);
        },
        toggleHighlight() {
            this.highlighted = !this.highlighted;
        }
    },
    computed: {
        prevStyle() {
            return 'button' + (this.i > 0 ? ' active' : '');
        },
        nextStyle() {
            return 'button' + (this.i < this.table.length - 1 ? ' active' : '');
        },
        Rows() {
            return Math.max(1, this.code.split('\n').length);
        },
        codeHTML() {
            return $.highlighter(this.code + ' ').replace(/\n/g, '</br>');
        },
        highlightClass() {
            return this.highlighted ? "highlighted" : "";
        }
    },
    watch: {
        theme(o, n) {
            if (o != n)
                this.save();
        }
    }
};
Vue.createApp(app).mount('#app');
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./src/sw.js')
        .then(function (registration) {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(function (error) {
            console.log('Service worker registration failed, error:', error);
        });
}