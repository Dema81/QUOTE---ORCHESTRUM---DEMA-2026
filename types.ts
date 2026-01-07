
export enum Language {
  ENGLISH = 'ENGLISH',
  ITALIAN = 'ITALIAN',
  SPANISH = 'SPANISH',
  CATALAN = 'CATALAN',
  GERMAN = 'GERMAN',
  FRENCH = 'FRENCH'
}

export interface QuoteFormData {
  clientLanguage: Language;
  emailTo: string;
  emailCc: string;
  recipientName: string;
  quoteId: string;
  subject: string;
  service: string;
  languages: string;
  amount: string;
  deliveryDays: string;
  signatureId: string;
}

export interface TranslationStrings {
  subjectPrefix: string;
  subjectMiddle: string;
  salutation: string;
  intro: string;
  delivery: string;
  decision: string;
  linkText: string;
  feedback: string;
  questions: string;
  closing: string;
  kindRegards: string;
  // Step 2 Form Labels
  labelRecipient: string;
  labelEmailTo: string;
  labelQuoteId: string;
  labelSubject: string;
  labelService: string;
  labelLanguages: string;
  labelAmount: string;
  labelDeliveryDays: string;
  labelCc: string;
  // Step 2 Form Placeholders
  placeholderRecipient: string;
  placeholderEmail: string;
  placeholderSubject: string;
  placeholderLanguages: string;
  placeholderAmount: string;
  // Response Email Localizations
  responseAccept: string;
  responseReject: string;
  responseReasonLabel: string;
  responseDetailsLabel: string;
  // Decision Page UI
  decisionPageTitle: string;
  btnAcceptQuote: string;
  btnRejectQuote: string;
  rejectionReasonsTitle: string;
  rejectionReasonTooLong: string;
  rejectionReasonPrice: string;
  rejectionReasonBudget: string;
  confirmAcceptTitle: string;
  confirmAcceptBody: string;
  confirmAcceptAction: string;
  confirmSendTitle: string;
  confirmSendBody: string;
  confirmSendAction: string;
  sentTitle: string;
  sentBody: string;
  btnEditResponse: string;
  cancelAction: string;
  attentionWarning: string;
}
