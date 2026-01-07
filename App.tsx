
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Copy, Mail, CheckCircle2, 
  Globe, Loader2, Edit3, AlertTriangle, X, Send, PenTool, ThumbsUp
} from 'lucide-react';
import { Language, QuoteFormData } from './types';
import { TRANSLATIONS } from './constants';

const SIGNATURES = [
  { id: 'aleksandra', name: 'Aleksandra Labudovic', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.', phone: '+39 039 9467 678', website: 'www.dema-solutions.com' },
  { id: 'alessia', name: 'Alessia Santoro', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.', phone: '+39 039 9467 678', website: 'www.dema-solutions.com' },
  { id: 'chiara', name: 'Chiara Tommasini', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.', phone: '+39 039 9467 678', website: 'www.dema-solutions.com' },
  { id: 'gaetano', name: 'Gaetano Gambuto', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.', phone: '+39 039 9467 678', website: 'www.dema-solutions.com' },
  { id: 'luka', name: 'Luka Pavlovic', role: 'Sales Manager', company: 'DEMA SOLUTIONS S.R.L.', phone: '+39 039 9467 678', website: 'www.dema-solutions.com' },
  { id: 'maria', name: 'María Céspedes', role: 'Sales Manager', company: 'Link Multilingüe, SL', phone: '+34 972 221 721', website: 'www.linkmultilingue.com' },
];

const LOGO_URL = "./logo_2.png"; 

const App: React.FC = () => {
  const [view, setView] = useState<'generator' | 'decision'>('generator');
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showResponseConfirm, setShowResponseConfirm] = useState(false);

  const [formData, setFormData] = useState<QuoteFormData>({
    clientLanguage: Language.ENGLISH,
    emailTo: '',
    emailCc: 'gr-quotes@dema-solutions.com',
    recipientName: '',
    quoteId: new Date().getFullYear() + '/',
    subject: '',
    service: 'Translation',
    languages: '',
    amount: '',
    deliveryDays: '3-5',
    signatureId: '' 
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'decision' || params.has('quoteID')) {
      setView('decision');
      const langParam = params.get('clientLanguage') as Language;
      const validLang = Object.values(Language).includes(langParam) ? langParam : Language.ENGLISH;
      setFormData(prev => ({
        ...prev,
        clientLanguage: validLang,
        emailTo: params.get('emailTo') || params.get('sender') || '',
        emailCc: params.get('emailCc') || params.get('cc') || 'gr-quotes@dema-solutions.com',
        recipientName: params.get('recipientName') || '',
        quoteId: params.get('quoteID') || '',
        subject: params.get('subject') || '',
        service: params.get('service') || 'Translation',
        languages: params.get('languages') || '',
        amount: params.get('amount') || '',
        deliveryDays: params.get('deliveryDays') || '',
        signatureId: params.get('signatureId') || ''
      }));
      setRejectionReason(TRANSLATIONS[validLang].rejectionReasonTooLong);
    }
  }, []);

  const t = TRANSLATIONS[formData.clientLanguage];
  const selectedSignature = SIGNATURES.find(s => s.id === formData.signatureId);

  const handleCreateMail = () => {
    const mailSubject = `${t.subjectPrefix}: ${formData.quoteId} - ${t.subjectMiddle} - ${formData.subject}`;
    const linkUrl = `${window.location.origin}${window.location.pathname}?view=decision&quoteID=${encodeURIComponent(formData.quoteId)}&subject=${encodeURIComponent(formData.subject)}&service=${encodeURIComponent(formData.service)}&languages=${encodeURIComponent(formData.languages)}&amount=${encodeURIComponent(formData.amount)}&recipientName=${encodeURIComponent(formData.recipientName)}&clientLanguage=${formData.clientLanguage}&emailCc=${encodeURIComponent(formData.emailCc)}&emailTo=${encodeURIComponent(formData.emailTo)}&deliveryDays=${formData.deliveryDays}&signatureId=${formData.signatureId}`;
    const signatureText = selectedSignature ? `\n\n${selectedSignature.name}\n${selectedSignature.role}\n${selectedSignature.company}\n\n📞 ${selectedSignature.phone}\n🌐 ${selectedSignature.website}` : '';
    const salutation = formData.recipientName.trim() ? `${t.salutation} ${formData.recipientName},` : `${t.salutation},`;
    const body = `${salutation}\n${t.intro} (Ref: ${formData.quoteId})\n${t.delivery.replace('{days}', formData.deliveryDays)}\n\n${t.decision} ${linkUrl}\n\n${t.feedback}\n\n${t.questions}\n${t.closing}\n${t.kindRegards}${signatureText}`;
    window.location.href = `mailto:${formData.emailTo}?cc=${encodeURIComponent(formData.emailCc)}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  const handleInviaRisposta = () => {
    const isAccept = decision === 'accept';
    const mailSubject = `RE: ${t.subjectPrefix}: ${formData.quoteId} - ${formData.subject}`;
    let body = `${isAccept ? t.responseAccept : t.responseReject}\n\n`;
    if (!isAccept) body += `${t.responseReasonLabel}: ${rejectionReason}\n\n`;
    body += `${t.responseDetailsLabel}:\n-----------------------\nID: ${formData.quoteId}\nSubj: ${formData.subject}\nAmt: ${formData.amount}`;
    window.location.href = `mailto:${formData.emailTo || 'gr-quotes@dema-solutions.com'}?cc=${encodeURIComponent(formData.emailCc)}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setShowResponseConfirm(false);
  };

  if (view === 'decision') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl text-center">
          <img src={LOGO_URL} alt="DEMA" className="max-w-[180px] mx-auto mb-10" />
          {sent ? (
            <div className="py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><ThumbsUp size={32} /></div>
              <h2 className="text-2xl font-bold text-slate-800">{t.sentTitle}</h2>
              <p className="text-slate-600 mt-2">{t.sentBody}</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-8">{t.decisionPageTitle}</h1>
              <div className="text-left space-y-3 mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p><span className="font-bold text-slate-900 w-32 inline-block">{t.labelQuoteId}:</span> {formData.quoteId}</p>
                <p><span className="font-bold text-slate-900 w-32 inline-block">{t.labelSubject}:</span> {formData.subject}</p>
                <p><span className="font-bold text-slate-900 w-32 inline-block">{t.labelAmount}:</span> {formData.amount}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setDecision('accept')} className={`flex-1 py-4 rounded-xl font-bold text-white transition-all ${decision === 'accept' ? 'bg-green-700' : 'bg-green-600'}`}>{t.btnAcceptQuote}</button>
                <button onClick={() => setDecision('reject')} className={`flex-1 py-4 rounded-xl font-bold text-white transition-all ${decision === 'reject' ? 'bg-red-700' : 'bg-red-600'}`}>{t.btnRejectQuote}</button>
              </div>
              {decision === 'reject' && (
                <div className="mt-6 text-left p-6 bg-red-50 rounded-xl border border-red-100 space-y-3">
                  <h3 className="font-bold text-slate-800">{t.rejectionReasonsTitle}</h3>
                  {[t.rejectionReasonTooLong, t.rejectionReasonPrice, t.rejectionReasonBudget].map(r => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer"><input type="radio" checked={rejectionReason === r} onChange={() => setRejectionReason(r)} className="w-5 h-5 accent-red-600"/><span className="text-slate-700">{r}</span></label>
                  ))}
                </div>
              )}
              {decision && (
                <button onClick={handleInviaRisposta} className="w-full mt-8 bg-[#0076a8] text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Send size={18} /> {t.confirmSendAction}</button>
              )}
              <p className="text-slate-400 text-xs mt-6 italic">{t.attentionWarning}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
          <img src={LOGO_URL} alt="DEMA" className="h-10" />
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quote Generator v2</div>
        </div>
        {step === 1 ? (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6">1. Select client's language</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {Object.values(Language).map(lang => (
                <button key={lang} onClick={() => { setFormData(prev => ({...prev, clientLanguage: lang})); setStep(2); }} className="p-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all">
                  {lang}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6">2. Quote Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Recipient</label><input type="text" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Maria"/></div>
              <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Quote ID</label><input type="text" value={formData.quoteId} onChange={e => setFormData({...formData, quoteId: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Amount</label><input type="text" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1.250€"/></div>
              <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Languages</label><input type="text" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. EN-IT"/></div>
              <div className="space-y-1 sm:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase">Subject</label><input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Project name..."/></div>
              <div className="space-y-1 sm:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase">Signature</label>
                <select value={formData.signatureId} onChange={e => setFormData({...formData, signatureId: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 bg-white">
                  <option value="">NO SIGNATURE</option>
                  {SIGNATURES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Back</button>
              <button onClick={handleCreateMail} className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-900 flex items-center justify-center gap-2"><Mail size={18}/> Send to Client</button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-8 text-slate-400 text-sm italic">DEMA Solutions - Management System</p>
    </div>
  );
};

export default App;
