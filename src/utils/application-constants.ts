/**
 * Contains the constants which can be used in whole application.
 */
export const ApplicationConstants = {
    APPROVED_DENIED_WAITLIST_PRIORITY_ORDER: -1,

    EMAIL_FOR_RESIDENT_COMPANY_FORM_SUBMISSION: 'MAIL_FOR_RESIDENT_COMPANY_FORM_SUBMISSION',
    EMAIL_SUBJECT_FOR_RESIDENT_COMPANY_FORM_SUBMISSION: 'Biolabs | Form Submitted',
    EMAIL_CONTENT_PARAM_FOR_RESIDENT_COMPANY_FORM_SUBMISSION: 'applicationFormSubmit',

    EMAIL_FOR_SPACE_CHANGE_REQUEST_SUBMITTED: 'MAIL_FOR_SPACE_CHANGE_WAITLIST_SAVE',
    EMAIL_SUBJECT_FOR_SPACE_CHANGE_REQUEST_SUBMITTED: 'Biolabs | Space Change Request Submitted',
    EMAIL_CONTENT_PARAM_FOR_SPACE_CHANGE_REQUEST_SUBMITTED: 'spaceChangeWaitlistSubmit',

    EMAIL_FOR_SPONSORSHIP_QN_CHANGE_TO_YES: 'MAIL_FOR_SPONSORSHIP_QN_CHANGE_TO_YES',
    EMAIL_SUBJECT_FOR_SPONSORSHIP_QN_CHANGE_TO_YES: 'Biolabs | A Company has changed their privacy settings',
    EMAIL_CONTENT_PARAM_FOR_SPONSORSHIP_QN_CHANGE_TO_YES: 'sponsorshipQuestionChangedToYes',

    EMAIL_FOR_SPONSOR_SCHEDULED: 'MAIL_FOR_SPONSOR_SCHEDULED',
    /** {0} is for Date of the email sent */
    EMAIL_SUBJECT_FOR_SPONSOR_SCHEDULED: `BioLabs Network Insights | {0}`,
    EMAIL_PARAM_FOR_SPONSOR_MAIL_SCHEDULED: 'onboardedAndGraduatedCompanies',
    EMAIL_INTRO_TEXT_FOR_SPONSOR_MAIL_SCHEDULED: 'Here are some key insights from the BioLabs network since your last update:',
    EMAIL_TEXT_RECENTLY_JOINED_COMPANIES: `{0} companies have recently joined BioLabs{1}`,
    EMAIL_TEXT_RECENTLY_JOINED_A_COMPANY: `{0} company has recently joined BioLabs{1}`,
    EMAIL_TEXT_RECENTLY_GRADUATED_COMPANIES: `{0} companies have recently graduated{1}`,
    EMAIL_TEXT_RECENTLY_GRADUATED_A_COMPANY: `{0} company has recently graduated{1}`,
    EMAIL_TEXT_GRADUATING_SOON_COMPANIES: `{0} {1} graduating soon{2}`,

    /** Table column length */
    SPACE_CHANGE_WAITLIST_REQUEST_NOTES_COL_LENGTH: 600,
    SPACE_CHANGE_WAITLIST_GRADUATE_DESCRIPTION_COL_LENGTH: 510,

    /** Products type names skip be saved in external change request */
    SKIP_PRODUCT_TYPE_IDS: [6, 7],
    SKIP_PRODUCT_TYPE_NAMES: ['Retainer Fee', 'Decontamination Fee'],

    /** Email template paths */
    EMAIL_TEMPLATE_FORGOT_PASSWORD_PATH: '/src/modules/public/email-template/forgot-password.html',
    EMAIL_TEMPLATE_SPONSORSHIP_QN_CHANGE_TO_YES_PATH: '/src/modules/public/email-template/sponsorship-question-change-to-yes.html',
    EMAIL_TEMPLATE_SPONSORSHIP_PATH: '/src/modules/public/email-template/onboarding-graduated-companies.html',

    /** Flags to check company */
    ONBOARDED_COMPANIES: 'ONBOARDED_COMPANIES',
    GRADUATED_COMPANIES: 'GRADUATED_COMPANIES',
    GRADUATING_SOON_COMPANIES: 'GRADUATING_SOON_COMPANIES',
    FREQUENCY: 'FREQUENCY',
    SPONSOR_MAIL_RECORD_LIMIT : 3,

    SPONSOR_USER_ROLE: 3,

    DEFAULT_COMPANY_LOGO_PATH: 'assets/images/blPlaceholder.png',
    LOGO_PATH: 'api/file/read-image?fileType=logo&filename=',
    BIOLABS_CONNECT_PLATFORM: 'BioLabs connect platform',

    MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    COMPANY_LOGO_WIDTH_IN_EMAIL: '50px',
    COMPANY_LOGO_HEIGHT_IN_EMAIL: '50px',

    EMAIL_TEMPLATE_RESIDENT_COMPANY_FORM_SUBMISSION_PATH: '/src/modules/public/email-template/resident-company-form-submission.html',

    /** SUPER_ADMIN_EMAIL_ID BIOL-362*/
    SUPER_ADMIN_EMAIL_ID: 'superadmin@biolabs.io'
};