let app = {
    data() {
        return Lockr.get('YS-CACHE', {
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
            theme: 'light',
            solution: ''
        });
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
                this.alpha = $.duality(tab);
                while ($.hasNext(tab) && this.table.length <= 10) {
                    tab = $.iterate(tab);
                    this.table.push($.data2html(tab, $.heatMap(tab), this.epsilon));
                }
                this.solution = tab[0][tab[0].length - 1] + '* = ' + tab[tab.length - 1][tab[tab.length - 1].length - 1];
                if (this.table.length > 10) {
                    this.Error = 'Long term operation . double check your equations elseway we do not recommend you to use this algorithm';
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
            Lockr.set('YS-CACHE', {
                code:this.code,
                cache: this.cache,
                table: this.table,
                tab: this.tab,
                i: 0,
                alpha: '',
                Error: this.Error,
                OK: this.OK,
                menu: false,
                epsilon: this.epsilon,
                theme:this.theme,
                solution: this.solution
            });
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
            return $.highlighter(this.code).replace(/\n/g, '</br>');
        }
    },
    watch: {
        theme(o,n) {
            if (o!=n)
                this.save();
        }
    }
};
Vue.createApp(app).mount('#app');