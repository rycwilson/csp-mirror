import { Controller } from '@hotwired/stimulus';
import ModalController from './modal_controller.js';

export default class extends Controller<HTMLButtonElement> {
  static outlets = ['modal'];
  declare readonly modalOutlet: ModalController;

  static values = { 
    title: { type: String, default: 'Title is missing' },
    turboFrameAttrs: { type: Object, default: {} }
  };
  declare readonly titleValue: string;
  declare readonly turboFrameAttrsValue: { id: string, src: string };

  connect() {
  }

  showModal() {
    const { id: turboFrameId, src: turboFrameSrc } = this.turboFrameAttrsValue;
    this.modalOutlet.titleTarget.textContent = this.titleValue;
    if (turboFrameId && turboFrameSrc && this.modalOutlet.hasTurboFrameTarget) {
      this.modalOutlet.turboFrameAttrsValue = { ...this.turboFrameAttrsValue };
    }
    this.modalOutlet.show();
  }
}