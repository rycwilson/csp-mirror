import { Controller } from "@hotwired/stimulus";
import DashboardController from "./dashboard_controller";
import { getJSON, kebabize } from '../utils';
import { 
  init as initTable,
  initComplete as tableInitComplete,
  search as searchTable
} from '../tables.js';
import { tableConfig as customerWinsTableConfig, newCustomerWinPath } from '../customer_wins/customer_wins';
import { tableConfig as contributorsTableConfig, newContributionPath } from '../contributions/contributions';
import { tableConfig as promotedStoriesTableConfig } from '../promoted_stories/promoted_stories';
import DataTable from 'datatables.net-bs';
import type { Api, Config } from "datatables.net-bs";
import 'datatables.net-rowgroup-bs';

export default class ResourceController extends Controller<HTMLDivElement> {
  static outlets = ['dashboard', 'resource'];
  declare readonly dashboardOutlet: DashboardController;
  declare readonly resourceOutlets: ResourceController[];
  declare readonly hasResourceOutlet: boolean;

  static targets = ['curatorSelect', 'filterSelect', 'filterResults', 'datatable', 'newItemBtn', 'tableDisplayOptionsBtn'];
  declare readonly curatorSelectTarget: HTMLSelectElement;
  declare readonly filterSelectTarget: HTMLSelectElement;
  declare readonly filterResultsTarget: HTMLDivElement;
  declare readonly datatableTarget: HTMLDivElement;
  declare readonly newItemBtnTarget: HTMLButtonElement;
  declare readonly tableDisplayOptionsBtnTarget: HTMLButtonElement;
  
  static values = {
    dataPath: String,
    searchParams: { type: String, default: '' },
    init: { type: Boolean, default: false },
    checkboxFilters: { type: Object, default: {} }
  }
  declare readonly dataPathValue: string;
  declare readonly searchParamsValue: string;
  declare readonly initValue: boolean;
  declare checkboxFiltersValue: { [inputId: string]: { checked: boolean, label: string }};

  // dt is defined when the table is initialized
  // declare dt instead of initializing it to avoid having to allow for undefined value
  // if the table fails to initialize, errors will be handled in the datatable controller
  declare dt: Api<any>;
  
  connect() {
    // console.log(`connect ${this.resourceName}`)
  }

  get resourceName() {
    return this.element.dataset.resourceName as 'customerWins' | 'contributions' | 'promotedStories';
  }

  initValueChanged(shouldInit: boolean) {
    const ctrl = this;
    if (shouldInit) {
      if (CSP[ctrl.resourceName]) {
        initTable(ctrl);
      } else {
        getJSON(this.dataPathValue, this.searchParamsValue).then(data => {
          CSP[ctrl.resourceName] = data;
          initTable(ctrl);
        })
      }
    }
  }

  tableInitComplete(e: CustomEvent) {
    tableInitComplete(this, e.detail.dt);
  }

  searchTable(e: CustomEvent) {
    searchTable(this, e, this.resourceOutlets);
  }

  onCuratorChange(e: CustomEvent) {
    if (/customerWins|contributors/.test(this.resourceName)) this.updateNewItemPath();
    searchTable(this, e, this.resourceOutlets);
  }

  onFilterChange(e: CustomEvent) {
    if (/customerWins|contributors/.test(this.resourceName)) {
      this.updateNewItemPath();
      this.resourceOutlets.forEach(outlet => {
        if (outlet.resourceName === 'promotedStories') return;
        outlet.updateNewItemPath();
      });
    } 
    searchTable(this, e, this.resourceOutlets);
  }
  
  checkboxFiltersValueChanged(newVal: object, oldVal: object) {
    if (Object.keys(oldVal).length === 0) return false;
    searchTable(this);
  }

  tableConfig(): Config {
    switch (this.resourceName) {
      case 'customerWins':
        return customerWinsTableConfig();
      case 'contributions':
        return contributorsTableConfig();
      case 'promotedStories':
        return promotedStoriesTableConfig();
      // default: 
      //   throw new Error('Missing table configuration');
    } 
  }

  updateNewItemPath() {
    const filterVal = this.filterSelectTarget.value;
    const type = filterVal && filterVal.slice(0, filterVal.lastIndexOf('-'));
    const id = filterVal && filterVal.slice(filterVal.lastIndexOf('-') + 1, filterVal.length);
    const customerWinId = type === 'success' ? id : '';
    const params = new URLSearchParams();
    params.set('curator_id', this.curatorSelectTarget.value);
    if (filterVal) params.set(`${type}_id`, id);
    this.newItemBtnTarget.setAttribute(
      'data-modal-trigger-turbo-frame-attrs-value',
      JSON.stringify({ 
        id: `new-${kebabize(this.resourceName)}`.slice(0, -1),  // remove the trailing 's' 
        src: (() => {
          switch (this.resourceName) {
            case 'customerWins':
              return newCustomerWinPath(params);
            case 'contributions':
              return newContributionPath(customerWinId, params);
            default: 
              return '';
          }
        })()
      })
    );
  }
}