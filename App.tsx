
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Mail, Send, ThumbsUp, Globe, Info
} from 'lucide-react';

// --- TYPES ---
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

// --- CONSTANTS & TRANSLATIONS ---
const TRANSLATIONS: any = {
  [Language.ENGLISH]: {
    subjectPrefix: 'QUOTE', subjectMiddle: 'QUOTE REQUEST', salutation: 'Dear',
    intro: 'please find attached the requested quotation.',
    delivery: 'Delivery time: {days} working days from your order confirmation.',
    decision: 'You can communicate your decision through the following link:',
    feedback: 'Your feedback, even in case of rejection, is very important to us.',
    questions: "If you have any questions, please don't hesitate to contact us.",
    closing: 'Wishing you a good day.', kindRegards: 'Kind regards,',
    labelQuoteId: 'Quote ID', labelSubject: 'Subject', labelAmount: 'Amount',
    btnAcceptQuote: 'Accept quote', btnRejectQuote: 'Reject quote',
    rejectionReasonsTitle: 'Select the reason:', confirmSendAction: 'Send Email',
    rejectionReasonTooLong: 'Delivery time is too long',
    rejectionReasonPrice: 'Price is too high', rejectionReasonBudget: 'Out of budget',
    sentTitle: 'Success!', sentBody: 'Your response has been prepared.',
    decisionPageTitle: 'Quote Decision', attentionWarning: 'This action is final.'
  },
  [Language.ITALIAN]: {
    subjectPrefix: 'PREVENTIVO', subjectMiddle: 'RICHIESTA PREVENTIVO', salutation: 'Gentile',
    intro: 'in allegato trovi il preventivo richiesto.',
    delivery: 'Tempi di consegna: {days} giorni lavorativi dalla conferma.',
    decision: 'Puoi comunicare la tua decisione tramite il seguente link:',
    feedback: 'Il tuo feedback è molto importante per noi.',
    questions: 'Se hai domande, non esitare a contattarci.',
    closing: 'Ti auguriamo una buona giornata.', kindRegards: 'Cordiali saluti,',
    labelQuoteId: 'ID Preventivo', labelSubject: 'Oggetto', labelAmount: 'Importo',
    btnAcceptQuote: 'Accetta preventivo', btnRejectQuote: 'Rifiuta preventivo',
    rejectionReasonsTitle: 'Seleziona il motivo:', confirmSendAction: 'Invia Email',
    rejectionReasonTooLong: 'Tempi troppo lunghi',
    rejectionReasonPrice: 'Prezzo troppo alto', rejectionReasonBudget: 'Fuori budget',
    sentTitle: 'Inviato!', sentBody: 'La tua risposta è stata preparata.',
    decisionPageTitle: 'Decisione Preventivo', attentionWarning: 'Azione irreversibile.'
  }
  // Aggiungere altre lingue qui se necessario...
};

const SIGNATURES = [
  { id: 'aleksandra', name: 'Aleksandra Labudovic', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.' },
  { id: 'alessia', name: 'Alessia Santoro', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.' },
  { id: 'chiara', name: 'Chiara Tommasini', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.' },
  { id: 'gaetano', name: 'Gaetano Gambuto', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.' },
  { id: 'luka', name: 'Luka Pavlovic', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.' },
  { id: 'maria', name: 'María Céspedes', role: 'Sales Manager', company: 'Link Multilingüe, SL' },
];

const LOGO_URL = "./logo_2.png";

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [view, setView] = useState<'generator' | 'decision'>('generator');
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [formData, setFormData] = useState<QuoteFormData>({
    clientLanguage: Language.ENGLISH, emailTo: '', emailCc: 'gr-quotes@dema-solutions.com',
    recipientName: '', quoteId: new Date().getFullYear() + '/', subject: '',
    service: 'Translation', languages: '', amount: '', deliveryDays: '3-5', signatureId: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'decision' || params.has('quoteID')) {
      setView('decision');
      const lang = (params.get('clientLanguage') as Language) || Language.ENGLISH;
      setFormData(prev => ({
        ...prev,
        clientLanguage: lang,
        quoteId: params.get('quoteID') || '',
        subject: params.get('subject') || '',
        amount: params.get('amount') || '',
        emailTo: params.get('emailTo') || 'gr-quotes@dema-solutions.com'
      }));
    }
  }, []);

  const t = TRANSLATIONS[formData.clientLanguage] || TRANSLATIONS[Language.ENGLISH];
  const selectedSignature = SIGNATURES.find(s => s.id === formData.signatureId);

  const handleCreateMail = () => {
    const linkUrl = `${window.location.origin}${window.location.pathname}?view=decision&quoteID=${encodeURIComponent(formData.quoteId)}&subject=${encodeURIComponent(formData.subject)}&amount=${encodeURIComponent(formData.amount)}&clientLanguage=${formData.clientLanguage}&emailTo=${encodeURIComponent(formData.emailTo)}`;
    const sigText = selectedSignature ? `\n\n${selectedSignature.name}\n${selectedSignature.role}\n${selectedSignature.company}` : '';
    const body = `${t.salutation} ${formData.recipientName},\n${t.intro}\n${t.delivery.replace('{days}', formData.deliveryDays)}\n\n${t.decision}\n${linkUrl}\n\n${t.feedback}\n\n${t.kindRegards}${sigText}`;
    window.location.href = `mailto:${formData.emailTo}?cc=${formData.emailCc}&subject=${t.subjectPrefix}: ${formData.quoteId}&body=${encodeURIComponent(body)}`;
  };

  const handleSendResponse = () => {
    const isAccept = decision === 'accept';
    const body = `${isAccept ? 'I ACCEPT' : 'I REJECT'} THE QUOTE ${formData.quoteId}\nReason: ${rejectionReason}`;
    window.location.href = `mailto:${formData.emailTo}?subject=RE: ${formData.quoteId}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (view === 'decision') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-200">
          <img src={LOGO_URL} alt="DEMA" className="h-12 mx-auto mb-8" />
          {sent ? (
            <div className="py-8">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><ThumbsUp /></div>
              <h2 className="text-2xl font-bold">{t.sentTitle}</h2>
              <p className="text-slate-500 mt-2">{t.sentBody}</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-6">{t.decisionPageTitle}</h2>
              <div className="bg-slate-50 p-4 rounded-xl text-left mb-6 text-sm border border-slate-100">
                <p><strong>{t.labelQuoteId}:</strong> {formData.quoteId}</p>
                <p><strong>{t.labelSubject}:</strong> {formData.subject}</p>
                <p><strong>{t.labelAmount}:</strong> {formData.amount}</p>
              </div>
              <div className="flex gap-4 mb-6">
                <button onClick={() => setDecision('accept')} className={`flex-1 py-3 rounded-xl font-bold ${decision === 'accept' ? 'bg-green-700 text-white' : 'bg-green-100 text-green-700'}`}>{t.btnAcceptQuote}</button>
                <button onClick={() => setDecision('reject')} className={`flex-1 py-3 rounded-xl font-bold ${decision === 'reject' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700'}`}>{t.btnRejectQuote}</button>
              </div>
              {decision === 'reject' && (
                <div className="text-left bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                  <p className="font-bold text-xs uppercase text-red-800 mb-2">{t.rejectionReasonsTitle}</p>
                  {[t.rejectionReasonTooLong, t.rejectionReasonPrice, t.rejectionReasonBudget].map(r => (
                    <label key={r} className="flex items-center gap-2 mb-1 cursor-pointer text-sm">
                      <input type="radio" checked={rejectionReason === r} onChange={() => setRejectionReason(r)} /> {r}
                    </label>
                  ))}
                </div>
              )}
              {decision && (
                <button onClick={handleSendResponse} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors">
                  <Send size={18} /> {t.confirmSendAction}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-xl w-full border border-slate-200">
        <div className="flex justify-between items-center mb-10 pb-4 border-b">
          <img src={LOGO_URL} alt="DEMA" className="h-8" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quote Gen</span>
        </div>
        {step === 1 ? (
          <div>
            <h2 className="text-lg font-bold mb-6">1. Client Language</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(Language).map(lang => (
                <button key={lang} onClick={() => { setFormData({...formData, clientLanguage: lang}); setStep(2); }} className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 font-bold text-slate-600 transition-all text-sm">
                  {lang}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4">2. Quote Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Recipient Name" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="col-span-2 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
              <input placeholder="Quote ID" value={formData.quoteId} onChange={e => setFormData({...formData, quoteId: e.target.value})} className="p-3 rounded-xl border border-slate-200" />
              <input placeholder="Amount (e.g. 500€)" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="p-3 rounded-xl border border-slate-200" />
              <input placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="col-span-2 p-3 rounded-xl border border-slate-200" />
              <select value={formData.signatureId} onChange={e => setFormData({...formData, signatureId: e.target.value})} className="col-span-2 p-3 rounded-xl border border-slate-200 bg-white">
                <option value="">Select Signature</option>
                {SIGNATURES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-3 font-bold text-slate-400">Back</button>
              <button onClick={handleCreateMail} className="flex-2 bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                <Mail size={18} /> Create Quote Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
