// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

// import HelloController from "./hello_controller"
// application.register("hello", HelloController)

import TomselectController from './tomselect_controller';
application.register('tomselect', TomselectController);

import DatatableController from './datatable_controller';
application.register('datatable', DatatableController);

import DashboardController from './dashboard_controller';
application.register('dashboard', DashboardController);

import DashboardTabController from './dashboard_tab_controller';
application.register('dashboard-tab', DashboardTabController);

// import DashboardTabPanelController from './dashboard_tab_panel_controller';
// application.register('dashboardTabPanel', DashboardTabPanelController);

import ModalController from './modal_controller';
application.register('modal', ModalController);

import ModalTriggerController from './modal_trigger_controller';
application.register('modal-trigger', ModalTriggerController);

import StoriesController from './stories_controller';
application.register('stories', StoriesController);

import CustomerWinsController from './customer_wins_controller';
application.register('customer-wins', CustomerWinsController);

import CustomerWinController from './customer_win_controller';
application.register('customer-win', CustomerWinController);

import CustomerWinFormController from './customer_win_form_controller';
application.register('customer-win-form', CustomerWinFormController);

import ContributorsController from './contributors_controller';
application.register('contributors', ContributorsController);

import ContributionController from './contribution_controller';
application.register('contribution', ContributionController);

import ContributionFormController from './contribution_form_controller';
application.register('contribution-form', ContributionFormController);

import TableDisplayOptionsController from './table_display_options_controller';
application.register('table-display-options', TableDisplayOptionsController);

import ActionsDropdownController from './actions_dropdown_controller';
application.register('actions-dropdown', ActionsDropdownController);

import NewContactController from './new_contact_controller';
application.register('new-contact', NewContactController);