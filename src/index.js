let app = {
    data() {
        return {
            code: "",
            cache: [],
            table: "",
            i: 0,
            Error: '',
            OK:true
        }
    },
    methods: {
        refresh() {
            this.table = [];
            var tab = $.createTable(this.code);
            if ('type' in tab) {
                this.Error = 'Syntaxe Error';
                this.OK = false;
            } else {
                this.OK = true;
                this.table.push($.data2html(tab));
            while ($.hasNext(tab)) {
                tab = $.iterate(tab);
                this.table.push($.data2html(tab));
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
    }
};
Vue.createApp(app).mount('#app');
