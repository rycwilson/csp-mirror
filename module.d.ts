export {}

declare global {
  // https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript#answer-56984941
  var CSP: CustomerStoriesApp;

  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
    Stimulus: object;
    // DataTable: object;
    TomSelect: object;
    ContributionController: typeof ContributionController;
  }
  
  interface CustomerStoriesApp {
    customerWins: CustomerWin[] | undefined;
    contributions: Contribution[] | undefined;
    promotedStories: PromotedStory[] | undefined;
    currentUser: User | null;
    // screenSize: string;
    init(): void;
  }

  interface JQuery {
    tab: (action: string) => void;
    popover: (options: object) => void;
    modal: (action: string) => void;
  }
  
  interface JQueryStatic {
    summernote: {
      ui: any,
      plugins: any,
      range: any,
      interface: any, 
    }
  }
  
  interface HTMLElementEventMap {
    // rails-ujs events
    'ajax:before': CustomEvent,                 // Triggered before an element is replaced with the response content during an AJAX request.
    'ajax:success': CustomEvent,                // Triggered when an AJAX request is successful.
    'ajax:error': CustomEvent,                  // Triggered when an AJAX request encounters an error.
    'ajax:complete': CustomEvent,               // Triggered when an AJAX request is complete, regardless of success or error.
    'ajax:stopped': CustomEvent,                // Triggered when an AJAX request is halted before completion.
    'ajax:aborted': CustomEvent,                // Triggered when an AJAX request is aborted by the user.
    'ajax:after': CustomEvent,                  // Triggered after an element is replaced with the response content during an AJAX request.
    'ajax:file:validate': CustomEvent,          // Triggered before an AJAX file upload begins to validate the selected file.
    'ajax:file:beforeSerialize': CustomEvent,   // Triggered before serializing form data for an AJAX file upload.
    'ajax:file:serialize': CustomEvent,         // Triggered when serializing form data for an AJAX file upload.
    'ajax:file:beforeSubmit': CustomEvent,      // Triggered before submitting a form via AJAX when a file is involved.

    // turbo events
    'turbo:load': TurboLoadEvent;
    'turbo:click': TurboClickEvent;
    'turbo:before-visit': TurboBeforeVisitEvent;
    'turbo:visit': TurboVisitEvent;
    'turbo:submit-start': TurboSubmitStartEvent;
    'turbo:submit-end': TurboSubmitEndEvent;
    'turbo:before-render': TurboBeforeRenderEvent;
    'turbo:render': TurboRenderEvent;
    'turbo:frame-load': TurboFrameLoadEvent;
    'turbo:before-frame-render': TurboBeforeFrameRenderEvent;
    'turbo:frame-render': TurboFrameRenderEvent;
    'turbo:before-fetch-request': CustomEvent;
    'turbo:before-fetch-response': CustomEvent;
    'turbo:before-cache': CustomEvent;
  }

  interface HTMLSelectElement {
    tomselect: TomSelect;
  }

  interface TurboFrameAttributes {
    id: string;
    src?: string;
    loading?: string;
    target?: string;
    disable?: boolean;  
    dataTurboAction?: string;
    dataAutoScrollBlock?: boolean | { block?: string, behavior?: string, inline?: string };

    // this applies to turbo-frame elements
    dataset: {
      placeholder?: string;
    }
  }

  interface Customer {
    id?: number;
    name?: string;
    slug?: string;
  }

  interface CustomerWin {
    id: number;
    name: string;
    customer_id: number; 
    curator_id: number; 
    curator: User; 
    customer: Customer; 
    display_status?: string;
    story: Story;
  }

  interface Story {
    id: number;
    title: string;
    published: boolean;
    slug: string;
    csp_story_path: string;
  }

  interface PromotedStory extends Omit<Story, 'published'> {
    published: true;
    ads_status: string;
    ads_long_headline: string;
    ads_images: Array<any>;
    success: { customer: Customer };
    topic_ad: { id: number, status: string };
    retarget_ad: { id: number, status: string };
  }

  interface User {
    id: number;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    title?: string;
    email?: string;
    linkedin_url?: string;
  }

  interface Contribution {
    // attributes
    id: number;
    status?: string;
    contribution?: string;
    feedback?: string;
    submitted_at?: string;
    publish_contributor?: boolean;
    contributor_unpublished?: boolean;
    request_subject?: string;
    request_body?: string;
    request_sent_at?: string;
    
    // methods
    display_status?: string;
    timestamp?: number;

    // associations
    customer?: Customer
    success?: CustomerWin;
    contributor?: User;
    referrer?: User;
    invitation_template?: InvitationTemplate;
    answers?: ContributorAnswer[];
  }

  interface InvitationTemplate {
    id: number;
    name: string;
  }

  interface ContributorQuestion {
    id?: number;
    question?: string;
  }

  interface ContributorAnswer {
    answer: string;
    contribution_id: number;
    contributor_question_id: number;
    question: ContributorQuestion;
  }
}