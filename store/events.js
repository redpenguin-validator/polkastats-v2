import axios from 'axios';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, events) {
    // Send Google Analytics event: Category, action, label, value
    // console.log(`Updating intentions store, sending event to Google Analytics!`);
    // this.$ga.event('vuex-store', 'update-events');

    state.list = events;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    axios.get('https://polkastats.io:8443/events')
      .then(function (response) {
        context.commit('update', response.data);
      })
  }
}