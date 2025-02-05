import FormController from './form_controller';
import { imageValidatorOptions } from '../user_uploads';
// import { bsToast } from '../utils';

export default class AdsController extends FormController<AdsController> {
  static targets = [
    'shortHeadlineSubmitBtn',
    'imageRequirements', 
    'imageCard',
    'defaultImageCard',
    'newImageCard', 
    'newLogoCard',
    'requirementsHelpBlock'
  ];
  declare readonly shortHeadlineInputTarget: HTMLInputElement;
  declare readonly shortHeadlineSubmitBtnTarget: HTMLButtonElement;
  declare readonly imageRequirementsTargets: HTMLAnchorElement[];
  declare readonly imageCardTargets: HTMLLIElement[];
  declare readonly defaultImageCardTargets: HTMLLIElement[];
  declare readonly newImageCardTarget: HTMLLIElement;
  declare readonly newLogoCardTarget: HTMLLIElement;
  declare readonly requirementsHelpBlockTargets: HTMLSpanElement[];

  validatedShortHeadlineHandler = this.onValidatedShortHeadline.bind(this);
  shownTabHandler = this.onShownTab.bind(this);

  connect() {
    super.connect();

    // jquery event listeners necessary for hooking into jquery plugin events
    $(this.element)
      .on('shown.bs.tab', this.shownTabHandler)
      .on('validated.bs.validator', this.validatedShortHeadlineHandler)
      .validator(imageValidatorOptions);
    this.imageRequirementsTargets.forEach(this.initPopover);
  }

  disconnect() {
    $(this.element)
      .off('shown.bs.tab', this.shownTabHandler)
      .off('validated.bs.validator', this.validatedShortHeadlineHandler)
      .validator('destroy');
    super.disconnect();
  }

  submitForm({ detail: { card, userAction } }: { detail: { card: HTMLLIElement, userAction: string } }) {
    const setFormat = (type: string) => {
      this.element.action = type === 'html' ? 
        this.element.action.replace(/\.json$/, '') :
        (this.element.action.endsWith('.json') ? this.element.action : `${this.element.action}.json`);
    };
    if (userAction == 'add') {
      setFormat('html');
    } else if (userAction === 'makeDefault') {
      setFormat('html');
    } else if (userAction === 'delete') {
      setFormat('json');
    }
    this.element.requestSubmit();
  }

  onValidatedShortHeadline({ relatedTarget: input }: { relatedTarget: HTMLInputElement }) {
    if (input.name.includes('short_headline')) {
      const shouldHideSubmitBtn = $(input).data()['bs.validator.errors'].length || input.value === input.dataset.initialValue;
      this.shortHeadlineSubmitBtnTarget.classList.toggle('hidden', shouldHideSubmitBtn);
    }
  }

  onShownTab() {
    this.requirementsHelpBlockTargets.forEach(span => span.classList.toggle('hidden'));
  }

  onDeletedImage({ detail: [res, status, xhr] }: { detail: [res: { id: string }, status: string, xhr: XMLHttpRequest] }) {
    const card = this.imageCardTargets.find(card => res.id == card.dataset.imageId);
    card?.remove();
    // bsToast('info', 'Image deleted successfully');
    // document.getElementById('toaster')?.setAttribute(
    //   'data-toast-flash-value', 
    //   JSON.stringify({ type: 'info', message: 'Image deleted successfully' })
    // );
  }
  
  uploadImage() {
    this.uploadFile(this.newImageCardTarget);
  }
  
  uploadLogo() {
    this.uploadFile(this.newLogoCardTarget);
  }

  uploadFile(card: HTMLLIElement) {
    card.setAttribute('data-image-card-open-file-dialog-value', 'true');
  }

  keepPreviousDefault({ detail: { prevDefaultImageId } }: { detail: { prevDefaultImageId: string } }) {
    const i = [
      ...this.defaultImageCardTargets, this.newImageCardTarget, this.newLogoCardTarget, ...this.imageCardTargets
    ].length;
    this.element.insertAdjacentHTML('beforeend', `
      <input type="hidden" name="company[adwords_images_attributes][${i}][id]" value="${prevDefaultImageId}">
      <input type="hidden" name="company[adwords_images_attributes][${i}][default]" value="false">
    `);
  }

  setNewDefault({
    detail: { card, kind, toggleDefault } }: { detail: { card: HTMLLIElement, kind: AdImageKind, toggleDefault: boolean }
  }) {
    const sameKind = (_card: HTMLLIElement) => (new RegExp(`--${kind}`)).test(_card.className);
    [...this.defaultImageCardTargets, ...this.imageCardTargets]
      .filter(_card => sameKind(_card) && _card !== card && card.dataset.imageId)
      .forEach(_card => {
        if (_card.classList.contains('gads-default')) {
          _card.setAttribute('data-image-card-inputs-enabled-value', toggleDefault ? 'true' : 'false');
          _card.setAttribute('data-image-card-toggle-default-value', toggleDefault ? 'false' : 'true');
        } else {
          _card.setAttribute('data-image-card-toggle-default-value', 'false');
        }
      });
  }

  initPopover(link: HTMLAnchorElement) {
    $(link).popover({
      html: true,
      container: 'body',
      placement: 'auto',
      template: `
        <div class="popover image-requirements" role="tooltip">
          <div class="arrow"></div>
          <h3 class="popover-title label-secondary"></h3>
          <div class="popover-content"></div>
        </div>
      `,
      content: function () {
        return `
          <h4><strong>Square ${$(this).is('.marketing') ? 'Image' : 'Logo'}</strong></h4>
          <span>(${$(this).is('.marketing') ? 'required' : 'optional/recommended'})</span>
          <ul>
            <li>Minimum dimensions: ${$(this).data('square-min')}</li>
            <li>Aspect ratio within 1% of ${$(this).data('square-ratio')}</li>
            ${$(this).is('.logos') ? 
              `<li>Suggested dimensions: ${$(this).data('square-suggest')}</li>` : 
              ''
            }
            <li>Maximum size: 5MB (5,242,880 bytes)</li>
            <li>Image may be cropped horizontally up to 5% on each side</li>
            <li>Text may cover no more than 20% of the image</li>
            ${$(this).is('.logos') ?
              '<li>Transparent background is best, but only if the logo is centered</li>' : 
              ''
            }
          </ul>
          <h4><strong>Landscape ${$(this).is('.marketing') ? 'Image' : 'Logo'}</strong></h4>
          <span>(${$(this).is('.marketing') ? 'required' : 'optional/recommended'})</span>
          <ul>
            <li>Minimum dimensions: ${$(this).data('landscape-min')}</li>
            <li>Aspect ratio within 1% of ${$(this).data('landscape-ratio')}</li>
            ${$(this).is('.logos') ? 
              `<li>Suggested dimensions: ${$(this).data('landscape-suggest')}</li>` :
              ''
            }
            <li>Maximum size: 5MB (5,242,880 bytes)</li>
            <li>Image may be cropped horizontally up to 5% on each side</li>
            <li>Text may cover no more than 20% of the image</li>
            ${$(this).is('.logos') ? 
              '<li>Transparent background is best, but only if the logo is centered</li>' :
              ''
            }
          </ul>
        `;
      }
    });
  }
}