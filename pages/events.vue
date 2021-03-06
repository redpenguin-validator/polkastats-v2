<template>
  <div>
    <section>
      <b-container class="page-events main pt-4">
        <h1 class="text-center mb-4">Latest 5,000 Kusama events</h1>

        <!-- Filter -->
        <b-row>
          <b-col lg="12" class="mb-4">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Search event"
            ></b-form-input>
          </b-col>
        </b-row>
        <!-- Mobile sorting -->
        <div class="row d-block d-sm-block d-md-block d-lg-none d-xl-none">
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-4"
            >
              <b-input-group size="sm">
                <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
                  <template v-slot:first>
                    <option value="">-- none --</option>
                  </template>
                </b-form-select>
                <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </div>
        <!-- Table with sorting and pagination-->
        <div>
          <b-table
            stacked="md"
            id="events-table"
            head-variant="dark"
            :fields="fields"
            :items="events"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filterIncludedFields="filterOn"
            @filtered="onFiltered"
          >
            <template slot="blockNumber" slot-scope="data">
              <p class="text-right mb-0">
                {{ formatNumber(data.item.blockNumber) }}
              </p>
            </template>
            <template slot="eventIndex" slot-scope="data">
              <p class="text-right mb-0">
                {{ data.item.eventIndex }}
              </p>
            </template>
            <template slot="section" slot-scope="data">
              <p class="mb-0">
                {{ data.item.section }}
              </p>
            </template>
            <template slot="method" slot-scope="data">
              <p class="mb-0">
                {{ data.item.method }}
              </p>
            </template>
            <template slot="phase" slot-scope="data">
              <p class="mb-0">
                {{ data.item.phase }}
              </p>
            </template>
            <template slot="data" slot-scope="data">
              <p class="mb-0">
                {{ data.item.data }}
              </p>
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="events-table"
          ></b-pagination>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import axios from 'axios';
import bootstrap from 'bootstrap';
import commonMixin from '../mixins/commonMixin.js';

export default {
  head () {
    return {
      title: 'PolkaStats - Polkadot Kusama chain events',
      meta: [
        { hid: 'description', name: 'description', content: 'Polkadot Kusama chain events' }
      ]
    }
  },
  mixins: [commonMixin],
  data: function() {
    return {
      perPage: 10,
      currentPage: 1,
      sortBy: `blockNumber`,
      sortDesc: true,
      filter: null,
      filterOn: [],
      totalRows: 1,
      fields: [
        { key: 'blockNumber', label: 'Block', sortable: true, class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell` },
        { key: 'eventIndex', label: 'Index', sortable: true, filterByFormatted: true },
        { key: 'section', label: 'Section', sortable: true, class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell` },
        { key: 'method', label: 'Method', sortable: true, class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell` },
        { key: 'phase', label: 'Phase', sortable: true, class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell` },
        { key: 'data', label: 'Data', sortable: true, class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell` }
      ],
      polling: null
    }
  },
  computed: {
    events() {
      return this.$store.state.events.list;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        });
    }
  },
  created: function () {
    var vm = this;
    
    // Force update of events list if empty
    if (this.$store.state.events.list.length == 0) {
      vm.$store.dispatch('events/update');
    }
    this.totalRows = this.$store.state.events.list.length;


    // Update data every 10 seconds
    this.polling = setInterval(() => {
      vm.$store.dispatch('network/update');
      vm.$store.dispatch('events/update');
      if (!this.filter) this.totalRows = this.$store.state.events.list.length;
    }, 10000);

  },
  beforeDestroy: function () {
    clearInterval(this.polling);
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
<style>
#events-table th {
  text-align: center;
}
#events-table th:first-child {
  width: 8%;
}
#events-table th:nth-child(2) {
  width: 8%;
}
#events-table th:nth-child(3) {
  width: 10%;
}
#events-table th:nth-child(4) {
  width: 14%;
}
#events-table th:nth-child(5) {
  width: 14%;
}
#events-table th:nth-child(6) {
  width: 46%;
}
</style>