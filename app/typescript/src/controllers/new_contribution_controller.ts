import FormController from './form_controller';
import type ModalController from './modal_controller';
import type ResourceController from './resource_controller';

export default class NewContributionController extends FormController<NewContributionController> {
  // outlets
  declare readonly resourceOutlets: ResourceController[];
  declare readonly modalOutlet: ModalController;

  // targets
  declare readonly customerSelectTarget: TomSelectInput;
  declare readonly customerFieldTargets: HTMLInputElement[];
  declare readonly customerNameTarget: HTMLInputElement;
  declare readonly customerWinSelectTarget: TomSelectInput;
  declare readonly successFieldTargets: HTMLInputElement[];
  declare readonly successNameTarget: HTMLInputElement;
  declare readonly contributorSelectTarget: TomSelectInput;
  declare readonly referrerSelectTarget: TomSelectInput;

  declare customerCustomerWinIds: number[];
  customerWinsWereFiltered: boolean = false;

  connect() {
    const hasExistingCustomer = +this.customerSelectTarget.value;
    if (hasExistingCustomer && !this.customerWinSelectTarget.classList.contains('readonly')) {
      window.setTimeout(this.setCustomerWinIds.bind(this));
    }
  }

  get customerWinsCtrl() {
    return this.resourceOutlets.find(outlet => outlet.resourceName === 'customerWins');
  }

  get contributorsCtrl() {
    return this.resourceOutlets.find(outlet => outlet.resourceName === 'contributions');
  }

  onChangeCustomer() {
    this.handleCustomerChange();
  }

  onChangeCustomerWin() {
    this.handleCustomerWinChange();
  }
}