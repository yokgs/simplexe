let app = {
    data() {
        return {
            code: "max G = 4470B + 2316O + 2650M;B + O + M <= 1000;8B + 8B + 9M <= 8750;9B + 6O + 45M <= 16000",
            cache: [],
            table: [],
            tab: [],
            i: 0,
            Error: '',
            OK: true
        }
    },
    methods: {
        refresh() {
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
                this.table.push($.data2html(tab, $.heatMap(tab)));
                while ($.hasNext(tab) && this.table.length <= 10) {
                    tab = $.iterate(tab);
                    this.table.push($.data2html(tab, $.heatMap(tab)));
                }
                if (this.table.length > 10) {
                    this.Error = 'Long term operation . double check your equations elseway we do not recommend you to use this algorithm';
                    this.OK = false;
                }
            }

        },
        next() {
            if (this.i < this.table.length - 1)
                this.i++;
        },
        prev() {
            if (this.i > 0)
                this.i--;
        }
    },
    computed: {
        prevStyle() {
            return 'button' + (this.i > 0 ? ' active' : '');
        },
        nextStyle() {
            return 'button' + (this.i < this.table.length - 1 ? ' active' : '');
        }
    }
};
Vue.createApp(app).mount('#app');