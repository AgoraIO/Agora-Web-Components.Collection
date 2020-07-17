import Vue from 'vue';
import trackManager from './trackManager';

const store = new Map();
const eventBus = new Vue();

eventBus.$data.getStore = () => store;
eventBus.$data.getStore().set('trackManager', trackManager);

export default eventBus;
