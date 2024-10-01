

class SeptaChatbox {
    constructor(config) {
        // Required Parameters
        if (!config.client_id || !config.client_name || typeof config.access_level === 'undefined') {
            throw new Error("client_id, client_name, and access_level are required parameters.");
        }
        this.client_id = config.client_id;
        this.client_name = config.client_name;
        this.access_level = config.access_level;

        // URL is required if access_level is 1
        if (this.access_level === 1 && !config.url) {
            throw new Error("URL is required when access_level is set to 1.");
        }
        this.url = config.url || `${this.client_name}.septa.com`;

        // Optional Parameters for Theme
        this.theme = config.Theme || {};
        this.colorCode = this.theme.ColorCode || '#007bff';
        this.buttonSize = this.theme.ButtonSize || '16px';
        this.iconFile = this.theme.IconFile || null;

        // Initialize the chatbox UI
        this.initializeChatbox();
    }

    // Create and style elements
    initializeChatbox() {
        this.button = document.createElement('button');
        this.chatbox = document.createElement('div');
        this.chatHeader = document.createElement('div');
        this.expandButton = document.createElement('button');
        this.closeButton = document.createElement('button');
        this.chatContent = document.createElement('div');
        this.inputArea = document.createElement('div');
        this.input = document.createElement('input');
        this.sendButton = document.createElement('button');

        this.button.innerHTML = 'Ask Septa';
        this.button.style.cssText = `position:fixed;bottom:20px;right:20px;background:${this.colorCode};color:white;border:none;border-radius:25px;padding:10px 20px;font-size:${this.buttonSize};cursor:pointer;z-index:1000;`;
        this.chatbox.style.cssText = 'display:none;position:fixed;bottom:80px;right:20px;width:300px;height:400px;background:white;border:1px solid #ddd;border-radius:10px;z-index:1000;transition:all 0.3s ease;display:flex;flex-direction:column;';
        this.chatHeader.style.cssText = 'display:flex;justify-content:flex-end;padding:5px;background:#f8f9fa;border-bottom:1px solid #ddd;border-radius:10px 10px 0 0;';
        this.expandButton.innerHTML = '&#x26F6;';
        this.expandButton.style.cssText = 'background:none;border:none;cursor:pointer;font-size:16px;margin-right:5px;';
        this.closeButton.innerHTML = '&times;';
        this.closeButton.style.cssText = 'background:none;border:none;cursor:pointer;font-size:20px;';
        this.chatContent.style.cssText = 'flex-grow:1;overflow-y:auto;padding:10px;';
        this.inputArea.style.cssText = 'display:flex;padding:10px;border-top:1px solid #ddd;';
        this.input.style.cssText = 'flex-grow:1;margin-right:10px;padding:5px;';
        this.input.placeholder = 'Type your question...';
        this.sendButton.innerHTML = 'Send';
        this.sendButton.style.cssText = `background:${this.colorCode};color:white;border:none;border-radius:5px;padding:5px 10px;cursor:pointer;`;

        // Assemble elements
        this.chatHeader.appendChild(this.expandButton);
        this.chatHeader.appendChild(this.closeButton);
        this.chatbox.appendChild(this.chatHeader);
        this.chatbox.appendChild(this.chatContent);
        this.inputArea.appendChild(this.input);
        this.inputArea.appendChild(this.sendButton);
        this.chatbox.appendChild(this.inputArea);
        document.body.appendChild(this.button);
        document.body.appendChild(this.chatbox);

        // Event listeners
        this.addEventListeners();
    }

    // Event listeners
    addEventListeners() {
        this.button.onclick = () => {
            this.chatbox.style.display = this.chatbox.style.display === 'none' ? 'flex' : 'none';
        };

        let isExpanded = false;
        this.expandButton.onclick = () => {
            if (!isExpanded) {
                this.chatbox.style.width = '100%';
                this.chatbox.style.height = '100%';
                this.chatbox.style.top = '0';
                this.chatbox.style.left = '0';
                this.chatbox.style.right = '0';
                this.chatbox.style.bottom = '0';
                this.chatbox.style.borderRadius = '0';
                this.expandButton.innerHTML = '&#x26F7;';
            } else {
                this.chatbox.style.width = '300px';
                this.chatbox.style.height = '400px';
                this.chatbox.style.top = 'auto';
                this.chatbox.style.left = 'auto';
                this.chatbox.style.right = '20px';
                this.chatbox.style.bottom = '80px';
                this.chatbox.style.borderRadius = '10px';
                this.expandButton.innerHTML = '&#x26F6;';
            }
            isExpanded = !isExpanded;
        };

        this.closeButton.onclick = () => {
            this.chatbox.style.display = 'none';
            if (isExpanded) {
                this.expandButton.click(); // Reset to small size when closing
            }
        };

        this.sendButton.onclick = () => this.sendMessage();
        this.input.onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };
    }

    // Send message function
    sendMessage() {
        const message = this.input.value.trim();
        if (message) {
            this.addMessage(`You: ${message}`);
            const requestUrl = this.access_level === 1 ? this.url : `https://${this.client_name}.septa.com`;
            fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'English',
                    question: message,
                    conversationId: this.conversationId || 'conv_' + Date.now()
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    this.addMessage('Septa: ' + data.result);
                } else {
                    this.addMessage('Septa: Sorry, I couldn\'t process your request.');
                }
            })
            .catch(() => this.addMessage('Septa: Sorry, I encountered an error. Please try again.'));
            this.input.value = '';
        }
    }

    // Add message to chat
    addMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        this.chatContent.appendChild(p);
        this.chatContent.scrollTop = this.chatContent.scrollHeight;
    }
}


module.export=SeptaChatbox

