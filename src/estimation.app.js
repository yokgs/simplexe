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
    estimationTable: [],
    rawEntries: ""
},
    data = Defaults;// Lockr.get('YS-CACHE', Defaults);;
let app = {
    data() {
        return data;
    },
    methods: {
        parseInput() {
            this.estimationTable = this.rawEntries.trim().replace(/\n\n/g, '\n').split("\n").map(x => x.trim().split(" ").map(t => Number(t)));
            let T = [];

            for (let i = 0; i < this.estimationTable[0].length; i++) {
                T[i] = [];
                this.estimationTable.forEach(x => {
                    T[i].push(x[i]);
                });
            }
            meanRow = T.map(x => YUtil.mean(x));
            ecartRow = T.map(x => YUtil.variance(x)).map(Math.sqrt);
            this.estimationTable.push(meanRow, ecartRow,...(new esm(T)).map());
            
        },
        addRow() {
            let x = this.estimationTable.length,
                v = [];
            if (x > 0) v = this.estimationTable[x - 1];
            this.estimationTable[x] = YUtil.zero([v.length]);
        },
        addColumn() {
            for (let i = 0; i < this.estimationTable.length; i++)
                this.estimationTable[i].push(0);
        },
        toggleMenu() {
            this.menu = !this.menu;
        },
        save() {
            let newData = {};
            for (let i in Defaults) newData[i] = this[i];
            //Lockr.set('YS-CACHE', newData);
        }
    },
    computed: {

    },
    watch: {

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