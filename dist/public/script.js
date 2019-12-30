"use strict";var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));var textInput = document.getElementById('textInput');
var chat = document.getElementById('chat');
var inputOptions = '';

var context = {};

var templateChatMessage = function templateChatMessage(message, from) {return "\n  <div class=\"from-".concat(
  from, "\">\n    <div class=\"message-inner\">\n      <p>").concat(

  message, "</p>\n    </div>\n  </div>\n  ");};




// Crate a Element and append to chat
var InsertTemplateInTheChat = function InsertTemplateInTheChat(template) {
  var div = document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);
};

// Calling server and get the watson output
var getWatsonMessageAndInsertTemplate = /*#__PURE__*/function () {var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {var text,uri,response,template,options,elementsHTML,_args = arguments;return _regenerator["default"].wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:text = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
            uri = 'http://localhost:3000/conversation/';_context.next = 4;return (

              fetch(uri, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: (0, _stringify["default"])({
                  text: text,
                  context: context }) }));case 4:_context.next = 6;return _context.sent.

            json();case 6:response = _context.sent;

            context = response.context;

            template = templateChatMessage(response.output.text, 'watson');
            InsertTemplateInTheChat(template);


            if (response.output.options) {
              document.querySelector('p').insertAdjacentHTML('afterend', "<div class=\"options-dialog\" id=\"".concat(response.output.title, "\"></div>"));
              options = response.output.options;
              elementsHTML = '';
              options.forEach(function (option) {
                var html_option = "<a href=\"#\" class=\"input-option\" id=\"".concat(option.value.input.text, "\" onclick=\"dialogOption(this)\">").concat(option.label, "</a><br>");
                elementsHTML += html_option;
              });

              document.getElementById("".concat(response.output.title)).insertAdjacentHTML('afterbegin', elementsHTML);
            }case 11:case "end":return _context.stop();}}}, _callee);}));return function getWatsonMessageAndInsertTemplate() {return _ref.apply(this, arguments);};}();



var dialogOption = function dialogOption(option) {
  getWatsonMessageAndInsertTemplate(option.innerHTML);

  var template = templateChatMessage(option.innerHTML, 'user');
  InsertTemplateInTheChat(template);
};

textInput.addEventListener('keydown', function (event) {
  if (event.keyCode === 13 && textInput.value) {
    // Send the user message
    getWatsonMessageAndInsertTemplate(textInput.value);

    var template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);

    textInput.value = '';
  }
});


getWatsonMessageAndInsertTemplate();