const obs = new OBSWebSocket();

const app = new Vue({
  el: '#app',
  data: {
    login: {
      address: '',
      password: ''
    },
    schema: {
      requests: obs.availableRequests,
      events: obs.availableEvents,
      types: [
        "String",
        "Number",
        "Boolean"
      ]
    },
    selectedName: '',
    selectedParams: {},
    response: {},
    emits: [],
  },
  mounted: function() {
    obs.availableEvents.forEach(event => {
      obs.on(event, data => {
        this.emits.push({
          event,
          timestamp: Date.now(),
          data});
      });
    });

    this.loadLocalStorage();
  },
  computed: {
    formattedRequest() {
      let resp = this.getFormattedRequestInternal() || {};

      resp['request-type'] = this.selectedName;
      resp['message-id'] = '123';

      return resp;
    },
    reverseEmits() {
      return this.emits.slice().reverse();
    }
  },
  watch: {
    selectedName: function(newValue) {
      if (!this.selectedParams[newValue]) {
        Vue.set(this.selectedParams, newValue, []);
        this.addParam();
      }
    },
    selectedParams: {
      handler: function(newValue) {
        this.saveLocalStorage();
      },
      deep: true
    }
  },
  methods: {
    obsLogin: function() {
      obs.connect(this.login);
    },
    sendRequest: async function() {
      try {
        this.response = await obs.send(this.selectedName, this.getFormattedRequestInternal());
      } catch (e) {
        this.response = e;
      }
    },
    addParam: function() {
      this.selectedParams[this.selectedName].push({
        type: 'String',
        name: '',
        value: ''
      });
    },
    removeParam: function(index) {
      this.selectedParams[this.selectedName].splice(index, 1);
    },
    getFormattedRequestInternal: function() {
      if (this.selectedName == '' || !this.selectedParams[this.selectedName]) {
        return {};
      }

      let resp = {};

      this.selectedParams[this.selectedName].forEach((param) => {
        if (param.type === 'Number') {
          resp[param.name] = Number(param.value);
        } else if (param.type === 'Boolean') {
          resp[param.name] = Boolean(param.value);
        } else {
          resp[param.name] = param.value;
        }
      });

      return resp;
    },
    saveLocalStorage: function() {
      if (Object.keys(this.selectedParams).length) {
        localStorage.setItem('obs-store', JSON.stringify(this.selectedParams));
        localStorage.setItem('obs-store:address', this.login.address);
      }
    },
    loadLocalStorage: function() {
      this.selectedParams = JSON.parse(localStorage.getItem('obs-store') || '{}');
      this.login.address = localStorage.getItem('obs-store:address') || '';
    }
  }
});
