(function() {
  // Kingspan Chatbot Widget v2.2 - LARGER WINDOW
  
  function init() {
    const CONFIG = {
      SUPABASE_URL: 'https://xlblhwlljdpfgrgedldo.supabase.co',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYmxod2xsamRwZmdyZ2VkbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDg4NTksImV4cCI6MjA4NTgyNDg1OX0.pGrCWwTetdjz6Ru_Cv7yNBNm0RR7acyHOc1D4fILBP8'
    };

    const styles = `
      #ks-chat-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        background: linear-gradient(135deg, #B8860B 0%, #C99700 100%);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        z-index: 99998;
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #ks-chat-btn:hover { transform: scale(1.08); }
      #ks-chat-btn svg { width: 30px; height: 30px; fill: white; }
      
      #ks-chat-container {
        position: fixed;
        bottom: 95px;
        right: 20px;
        width: 475px;
        height: 650px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.18);
        display: none;
        flex-direction: column;
        z-index: 99999;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      #ks-chat-container.open { display: flex; }
      
      @media (max-width: 520px) {
        #ks-chat-container {
          width: calc(100% - 20px);
          right: 10px;
          bottom: 90px;
          height: 75vh;
        }
      }
      
      #ks-chat-header {
        background: linear-gradient(135deg, #B8860B 0%, #C99700 100%);
        color: white;
        padding: 16px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #ks-chat-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
      #ks-chat-header p { margin: 3px 0 0; font-size: 12px; opacity: 0.9; }
      #ks-chat-close {
        background: none;
        border: none;
        color: white;
        font-size: 26px;
        cursor: pointer;
        line-height: 1;
        padding: 0 4px;
      }
      #ks-chat-close:hover { opacity: 0.8; }
      
      #ks-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 14px;
        background: #f8f8f8;
      }
      
      .ks-msg {
        margin-bottom: 12px;
        max-width: 85%;
        animation: ksFadeIn 0.3s ease;
      }
      @keyframes ksFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .ks-msg.user { margin-left: auto; }
      .ks-msg .bubble {
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .ks-msg.user .bubble {
        background: linear-gradient(135deg, #B8860B 0%, #C99700 100%);
        color: white;
        border-bottom-right-radius: 4px;
      }
      .ks-msg.bot .bubble {
        background: white;
        color: #333;
        border: 1px solid #e0e0e0;
        border-bottom-left-radius: 4px;
      }
      .ks-msg .bubble a { color: #B8860B; text-decoration: underline; }
      .ks-msg.user .bubble a { color: #fff; }
      
      .ks-typing {
        display: flex;
        gap: 5px;
        padding: 12px 16px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        width: fit-content;
      }
      .ks-typing span {
        width: 7px;
        height: 7px;
        background: #B8860B;
        border-radius: 50%;
        animation: ksBounce 1.4s infinite ease-in-out;
      }
      .ks-typing span:nth-child(2) { animation-delay: 0.2s; }
      .ks-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes ksBounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-6px); }
      }
      
      #ks-chat-input-area {
        padding: 12px;
        background: white;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
      }
      #ks-chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
      }
      #ks-chat-input:focus { border-color: #B8860B; }
      #ks-chat-send {
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #B8860B 0%, #C99700 100%);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;
      }
      #ks-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
      #ks-chat-send svg { width: 20px; height: 20px; fill: white; }
      
      .ks-quick-btns {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .ks-quick-btn {
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 14px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .ks-quick-btn:hover { background: #B8860B; color: white; border-color: #B8860B; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const widgetHTML = `
      <button id="ks-chat-btn" aria-label="Open chat">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>
      </button>
      <div id="ks-chat-container" role="dialog" aria-label="Chat with Kingspan Assistant">
        <div id="ks-chat-header">
          <div>
            <h3>Kingspan Roofing Assistant</h3>
            <p>Ask about TPO, insulation & more</p>
          </div>
          <button id="ks-chat-close" aria-label="Close chat">&times;</button>
        </div>
        <div id="ks-chat-messages" role="log" aria-live="polite">
          <div class="ks-msg bot">
            <div class="bubble">
              👋 Hi! How can I help you with Kingspan roofing products today?
              <div class="ks-quick-btns">
                <span class="ks-quick-btn" data-q="What TPO membrane options do you have?">TPO Membranes</span>
                <span class="ks-quick-btn" data-q="Tell me about insulation products">Insulation</span>
                <span class="ks-quick-btn" data-q="How long does a TPO roof last?">TPO Lifespan</span>
                <span class="ks-quick-btn" data-q="I'd like to request a sample">Request Sample</span>
              </div>
            </div>
          </div>
        </div>
        <div id="ks-chat-input-area">
          <input type="text" id="ks-chat-input" placeholder="Type your question..." aria-label="Type your message">
          <button id="ks-chat-send" aria-label="Send message">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.id = 'ks-chat-widget';
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);

    let isOpen = false;
    let conversationHistory = [];
    let isLoading = false;

    const chatBtn = document.getElementById('ks-chat-btn');
    const chatContainer = document.getElementById('ks-chat-container');
    const closeBtn = document.getElementById('ks-chat-close');
    const messagesDiv = document.getElementById('ks-chat-messages');
    const inputEl = document.getElementById('ks-chat-input');
    const sendBtn = document.getElementById('ks-chat-send');

    chatBtn.onclick = () => {
      isOpen = !isOpen;
      chatContainer.classList.toggle('open', isOpen);
      if (isOpen) inputEl.focus();
    };
    
    closeBtn.onclick = () => {
      isOpen = false;
      chatContainer.classList.remove('open');
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        chatContainer.classList.remove('open');
      }
    });

    async function sendToAPI(message) {
      const response = await fetch(`${CONFIG.SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          message: message,
          history: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      return data.response;
    }

    function addMsg(text, isUser) {
      const div = document.createElement('div');
      div.className = `ks-msg ${isUser ? 'user' : 'bot'}`;
      
      const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
        .replace(/\n/g, '<br>');
      
      div.innerHTML = `<div class="bubble">${formatted}</div>`;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'ks-msg bot';
      div.id = 'ks-typing';
      div.innerHTML = '<div class="ks-typing"><span></span><span></span><span></span></div>';
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    function hideTyping() {
      const el = document.getElementById('ks-typing');
      if (el) el.remove();
    }

    async function send() {
      if (isLoading) return;
      
      const msg = inputEl.value.trim();
      if (!msg) return;

      isLoading = true;
      inputEl.value = '';
      inputEl.disabled = true;
      sendBtn.disabled = true;
      
      addMsg(msg, true);
      conversationHistory.push({ role: 'user', content: msg });
      
      showTyping();

      try {
        const reply = await sendToAPI(msg);
        hideTyping();
        addMsg(reply, false);
        conversationHistory.push({ role: 'assistant', content: reply });
      } catch (e) {
        hideTyping();
        console.error('Chat error:', e);
        addMsg('Sorry, I encountered an error. Please try again in a moment.', false);
      }

      isLoading = false;
      inputEl.disabled = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }

    sendBtn.onclick = send;
    inputEl.onkeypress = (e) => { if (e.key === 'Enter' && !e.shiftKey) send(); };

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('ks-quick-btn')) {
        inputEl.value = e.target.dataset.q;
        send();
      }
    });

    console.log('Kingspan Chatbot v2.2 loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
