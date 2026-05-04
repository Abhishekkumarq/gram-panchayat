import React, { useState, useRef, useEffect } from 'react';
import './GramMitra.css';

// ── Bilingual content ──────────────────────────────────────────────────────
const L = {
  en: {
    subtitle:   'Online  ·  Village Assistant',
    placeholder:'Type a message…',
    newChat:    'New Chat',
    welcome:    "Namaste! 🙏 I'm Gram Mitra, your Gram Panchayat assistant.\n\nHow can I help you today?",
    welcome_chips: ['Certificates', 'Tax Payment', 'Grievance', 'Schemes', 'Contact Us'],

    cert_menu:  "Which certificate do you need?",
    cert_chips: ['Birth Certificate', 'Income Certificate', 'Caste Certificate', 'Residence Certificate', '← Back'],

    birth_cert: "To apply for a Birth Certificate:\n\n1. Go to the Certificates section\n2. Select Birth Certificate\n3. Fill in the child's details\n4. Upload required documents\n5. Submit the application\n\nCertificate is issued within 7 working days.",
    income_cert:"To apply for an Income Certificate:\n\n1. Visit Certificates → Income Certificate\n2. Enter income details and upload documents\n3. Submit — approved in 5–7 working days.",
    caste_cert: "To apply for a Caste Certificate:\n\n1. Certificates → Caste Certificate\n2. Fill caste details and upload supporting documents\n3. Submit — processed in 7–10 days.",
    resid_cert: "To apply for a Residence Certificate:\n\n1. Certificates → Residence Certificate\n2. Enter address details\n3. Upload proof of address\n4. Submit — issued in 5 days.",
    cert_chips2:['← Back'],

    tax_menu:   "What would you like to do with taxes?",
    tax_chips:  ['Property Tax', 'Water Tax', 'View Tax Status', '← Back'],

    prop_tax:   "To pay Property Tax:\n\n1. Go to Tax Payment\n2. Enter your Property ID\n3. Check the due amount and click Pay\n4. Complete payment online\n\nA receipt will be sent to your registered mobile.",
    water_tax:  "To pay Water Tax:\n\n1. Visit Tax Payment\n2. Select Water Tax\n3. Enter your connection number\n4. Pay the due amount\n\nPayment reflects within 24 hours.",
    tax_status: "To view your tax status:\n\nGo to Tax Payment → My Tax Records to see all pending and paid tax entries.",
    tax_chips2: ['← Back'],

    griev_menu: "How can I help with your grievance?",
    griev_chips:['File New Grievance', 'Track Grievance', '← Back'],

    file_griev: "To file a grievance:\n\n1. Go to the Grievances section\n2. Click File New Grievance\n3. Describe your issue clearly\n4. Add location and photos if available\n5. Submit\n\nYou will receive a tracking ID.",
    track_griev:"To track your grievance:\n\n1. Go to Grievances → My Grievances\n2. Find your complaint by its tracking ID\n\nStatus moves: Pending → In Progress → Resolved.",
    griev_chips2:['← Back'],

    schemes:    "Available Government Schemes:\n\n• PM Awas Yojana — Housing support\n• Kisan Credit Card — Farming loans\n• Jan Dhan Yojana — Banking access\n• Ujjwala Yojana — LPG cylinders\n• PM Kisan — Direct farmer income\n\nVisit the Schemes section for eligibility details.",
    contact:    "Contact Gram Panchayat:\n\n📞 Helpline: 1800-555-0123\n📧 Email: gp@gov.in\n🕐 Mon – Sat, 9 AM to 6 PM\n📍 Panchayat Office, Main Road",
    fallback:   "I'm not sure I understood that. Please try one of the options below or type:\n• 'certificates'  • 'tax'  • 'grievance'  • 'schemes'",
    main_chips: ['Certificates', 'Tax Payment', 'Grievance', 'Schemes', 'Contact Us'],

    lang_switch:"Switching to Hindi. / हिंदी में बदल रहा हूं। 🙏",
  },
  hi: {
    subtitle:   'ऑनलाइन  ·  ग्राम सहायक',
    placeholder:'संदेश लिखें…',
    newChat:    'नई चैट',
    welcome:    "नमस्ते! 🙏 मैं ग्राम मित्र हूं, आपका ग्राम पंचायत सहायक।\n\nआज मैं आपकी कैसे मदद कर सकता हूं?",
    welcome_chips: ['प्रमाणपत्र', 'कर भुगतान', 'शिकायत', 'योजनाएं', 'संपर्क करें'],

    cert_menu:  "आपको कौन सा प्रमाणपत्र चाहिए?",
    cert_chips: ['जन्म प्रमाणपत्र', 'आय प्रमाणपत्र', 'जाति प्रमाणपत्र', 'निवास प्रमाणपत्र', '← वापस'],

    birth_cert: "जन्म प्रमाणपत्र के लिए आवेदन:\n\n1. प्रमाणपत्र अनुभाग में जाएं\n2. जन्म प्रमाणपत्र चुनें\n3. बच्चे का विवरण भरें\n4. आवश्यक दस्तावेज़ अपलोड करें\n5. आवेदन जमा करें\n\nप्रमाणपत्र 7 कार्य दिवसों में जारी होगा।",
    income_cert:"आय प्रमाणपत्र के लिए:\n\n1. प्रमाणपत्र → आय प्रमाणपत्र पर जाएं\n2. आय विवरण व दस्तावेज़ दर्ज करें\n3. जमा करें — 5–7 दिनों में मंज़ूर होगा।",
    caste_cert: "जाति प्रमाणपत्र के लिए:\n\n1. प्रमाणपत्र → जाति प्रमाणपत्र\n2. जाति विवरण भरें व दस्तावेज़ अपलोड करें\n3. जमा करें — 7–10 दिनों में प्रक्रिया होगी।",
    resid_cert: "निवास प्रमाणपत्र के लिए:\n\n1. प्रमाणपत्र → निवास प्रमाणपत्र\n2. पते का विवरण दर्ज करें\n3. निवास प्रमाण अपलोड करें\n4. जमा करें — 5 दिनों में जारी होगा।",
    cert_chips2:['← वापस'],

    tax_menu:   "कर के बारे में आप क्या करना चाहते हैं?",
    tax_chips:  ['संपत्ति कर', 'जल कर', 'कर स्थिति देखें', '← वापस'],

    prop_tax:   "संपत्ति कर भुगतान के लिए:\n\n1. कर भुगतान अनुभाग में जाएं\n2. अपना संपत्ति ID दर्ज करें\n3. बकाया राशि देखें और भुगतान करें\n4. ऑनलाइन भुगतान पूरा करें\n\nपंजीकृत मोबाइल पर रसीद भेजी जाएगी।",
    water_tax:  "जल कर भुगतान के लिए:\n\n1. कर भुगतान पर जाएं\n2. जल कर चुनें\n3. अपना कनेक्शन नंबर दर्ज करें\n4. बकाया राशि का भुगतान करें\n\n24 घंटे में भुगतान दिखेगा।",
    tax_status: "कर स्थिति जांचने के लिए:\n\nकर भुगतान → मेरे कर रिकॉर्ड में जाएं। सभी लंबित और भुगतान किए गए कर यहाँ दिखेंगे।",
    tax_chips2: ['← वापस'],

    griev_menu: "शिकायत के बारे में मैं कैसे मदद करूं?",
    griev_chips:['नई शिकायत दर्ज करें', 'शिकायत ट्रैक करें', '← वापस'],

    file_griev: "शिकायत दर्ज करने के लिए:\n\n1. शिकायत अनुभाग में जाएं\n2. नई शिकायत पर क्लिक करें\n3. अपनी समस्या स्पष्ट रूप से बताएं\n4. स्थान व फ़ोटो जोड़ें (यदि हो)\n5. जमा करें\n\nआपको एक ट्रैकिंग ID मिलेगा।",
    track_griev:"शिकायत ट्रैक करने के लिए:\n\n1. शिकायत → मेरी शिकायतें\n2. ट्रैकिंग ID से शिकायत खोजें\n\nस्थिति: लंबित → प्रगति में → समाधान।",
    griev_chips2:['← वापस'],

    schemes:    "उपलब्ध सरकारी योजनाएं:\n\n• PM आवास योजना — आवास सहायता\n• किसान क्रेडिट कार्ड — कृषि ऋण\n• जन धन योजना — बैंकिंग सुविधा\n• उज्ज्वला योजना — LPG सिलेंडर\n• PM किसान — किसान आय सहायता\n\nपात्रता के लिए योजना अनुभाग देखें।",
    contact:    "ग्राम पंचायत संपर्क:\n\n📞 हेल्पलाइन: 1800-555-0123\n📧 ईमेल: gp@gov.in\n🕐 सोम – शनि, सुबह 9 – शाम 6\n📍 पंचायत कार्यालय, मुख्य सड़क",
    fallback:   "मुझे समझ नहीं आया। कृपया नीचे दिए विकल्प चुनें या लिखें:\n• 'प्रमाणपत्र'  • 'कर'  • 'शिकायत'  • 'योजना'",
    main_chips: ['प्रमाणपत्र', 'कर भुगतान', 'शिकायत', 'योजनाएं', 'संपर्क करें'],

    lang_switch:"Switching to English. / अंग्रेज़ी में बदल रहा हूं। 🙏",
  }
};

// ── Intent matcher ─────────────────────────────────────────────────────────
function getIntent(text, lang) {
  const t = text.toLowerCase().trim();

  // Back → main menu
  if (/^(← back|← वापस|back|वापस|menu|मेनू)$/.test(t)) return { key: 'welcome', chips: L[lang].welcome_chips };

  // Certificate sub-types
  if (/birth|जन्म/.test(t))                              return { key: 'birth_cert',  chips: L[lang].cert_chips2 };
  if (/income|आय/.test(t))                               return { key: 'income_cert', chips: L[lang].cert_chips2 };
  if (/caste|जाति/.test(t))                              return { key: 'caste_cert',  chips: L[lang].cert_chips2 };
  if (/resid|निवास/.test(t))                             return { key: 'resid_cert',  chips: L[lang].cert_chips2 };

  // Certificate menu
  if (/cert|प्रमाण|document|दस्तावेज/.test(t))           return { key: 'cert_menu',  chips: L[lang].cert_chips };

  // Tax sub-types
  if (/property|संपत्ति/.test(t))                        return { key: 'prop_tax',   chips: L[lang].tax_chips2 };
  if (/water|जल/.test(t))                                return { key: 'water_tax',  chips: L[lang].tax_chips2 };
  if (/status|स्थिति/.test(t))                           return { key: 'tax_status', chips: L[lang].tax_chips2 };

  // Tax menu
  if (/tax|कर|pay|भुगतान/.test(t))                       return { key: 'tax_menu',   chips: L[lang].tax_chips };

  // Grievance sub-types
  if (/file|new|नई/.test(t))                             return { key: 'file_griev', chips: L[lang].griev_chips2 };
  if (/track|ट्रैक/.test(t))                             return { key: 'track_griev',chips: L[lang].griev_chips2 };

  // Grievance menu
  if (/griev|complaint|शिकायत|समस्या/.test(t))           return { key: 'griev_menu', chips: L[lang].griev_chips };

  // Schemes & contact
  if (/scheme|yojana|योजना/.test(t))                     return { key: 'schemes',    chips: L[lang].main_chips };
  if (/contact|संपर्क|phone|फोन|help/.test(t))           return { key: 'contact',    chips: L[lang].main_chips };

  // Greetings
  if (/^(hi|hello|namaste|hey|नमस्ते|helo)/.test(t))    return { key: 'welcome',    chips: L[lang].welcome_chips };

  return { key: 'fallback', chips: L[lang].main_chips };
}

// ── Component ──────────────────────────────────────────────────────────────
let nextId = 1;

export default function GramMitra() {
  const [open, setOpen]       = useState(false);
  const [lang, setLang]       = useState('en');
  const [typing, setTyping]   = useState(false);
  const [input, setInput]     = useState('');
  const [msgs, setMsgs]       = useState(() => [{
    id: nextId++,
    from: 'bot',
    text: L.en.welcome,
    chips: L.en.welcome_chips,
  }]);
  const endRef  = useRef(null);
  const inputRef= useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const pushBot = (text, chips, delay = 650) => {
    setTyping(true);
    setTimeout(() => {
      setMsgs(p => [...p, { id: nextId++, from: 'bot', text, chips }]);
      setTyping(false);
    }, delay);
  };

  const send = (text) => {
    if (!text?.trim()) return;
    setMsgs(p => [...p, { id: nextId++, from: 'user', text: text.trim() }]);
    setInput('');
    const { key, chips } = getIntent(text, lang);
    const reply = L[lang][key] || L[lang].fallback;
    pushBot(reply, chips);
  };

  const switchLang = () => {
    const nl = lang === 'en' ? 'hi' : 'en';
    setLang(nl);
    pushBot(L[lang].lang_switch, L[nl].main_chips, 300);
  };

  const resetChat = () => {
    setMsgs([{ id: nextId++, from: 'bot', text: L[lang].welcome, chips: L[lang].welcome_chips }]);
    setInput('');
    setTyping(false);
  };

  return (
    <>
      {/* Floating action button */}
      <button className="gm-fab" onClick={() => setOpen(o => !o)} aria-label="Gram Mitra Chat">
        {open
          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
        }
      </button>

      {/* Chat panel */}
      {open && (
        <div className="gm-panel">

          {/* Header */}
          <div className="gm-header">
            <div className="gm-header-left">
              <div className="gm-avatar">GM</div>
              <div>
                <div className="gm-name">Gram Mitra</div>
                <div className="gm-status">{L[lang].subtitle}</div>
              </div>
            </div>
            <div className="gm-header-right">
              <button className="gm-lang-btn" onClick={switchLang} title="Switch language">
                {lang === 'en' ? 'हिं' : 'EN'}
              </button>
              <button className="gm-ctrl-btn" onClick={resetChat} title={L[lang].newChat}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                </svg>
              </button>
              <button className="gm-ctrl-btn" onClick={() => setOpen(false)} title="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="gm-messages">
            {msgs.map(msg => (
              <div key={msg.id} className={`gm-row gm-row-${msg.from}`}>
                {msg.from === 'bot' && <div className="gm-bot-avatar">GM</div>}
                <div className="gm-col">
                  <div className={`gm-bubble gm-bubble-${msg.from}`}>
                    {msg.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</React.Fragment>
                    ))}
                  </div>
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="gm-chips">
                      {msg.chips.map(c => (
                        <button key={c} className="gm-chip" onClick={() => send(c)}>{c}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="gm-row gm-row-bot">
                <div className="gm-bot-avatar">GM</div>
                <div className="gm-bubble gm-bubble-bot gm-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input bar */}
          <div className="gm-input-bar">
            <input
              ref={inputRef}
              className="gm-input"
              placeholder={L[lang].placeholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              disabled={typing}
            />
            <button
              className="gm-send-btn"
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
