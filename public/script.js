const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');
let inputOptions = '';

let context = {};

const templateChatMessage = (message, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${message}</p>
    </div>
  </div>
  `;

// Crate a Element and append to chat
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);
};

// Calling server and get the watson output
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'https://bot-tha.netlify.com/conversation/';

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      context,
    }),
  })).json();

  context = response.context;

  const template = templateChatMessage(response.output.text, 'watson');
  InsertTemplateInTheChat(template);


  if (response.output.options) {
    document.querySelector('p').insertAdjacentHTML('afterend', `<div class="options-dialog" id="${response.output.title}"></div>`);
    const options = response.output.options
    let elementsHTML = ''
    options.forEach(option => {
      const html_option = `<a href="#" class="input-option" id="${option.value.input.text}" onclick="dialogOption(this)">${option.label}</a><br>`
      elementsHTML += html_option
    })

    document.getElementById(`${response.output.title}`).insertAdjacentHTML('afterbegin', elementsHTML)
  }

};

const dialogOption = (option) => {
  getWatsonMessageAndInsertTemplate(option.innerHTML);

  const template = templateChatMessage(option.innerHTML, 'user');
  InsertTemplateInTheChat(template);
};

textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    // Send the user message
    getWatsonMessageAndInsertTemplate(textInput.value);

    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);

    textInput.value = '';
  }
});


getWatsonMessageAndInsertTemplate();
