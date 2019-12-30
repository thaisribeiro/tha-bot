"use strict";var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _v = _interopRequireDefault(require("ibm-watson/assistant/v1"));
var _auth = require("ibm-watson/auth");
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _ramda = require("ramda");

var app = (0, _express["default"])();


_dotenv["default"].config();

app.use(_bodyParser["default"].json());

var port = process.env.PORT || 3000;

var assistant = new _v["default"]({
  authenticator: new _auth.IamAuthenticator({ apikey: process.env.API_KEY }),
  version: '2018-02-16' });


var message_bot = /*#__PURE__*/function () {var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(text) {var context,params,response,result,dialogNode,dialog,_args = arguments;return _regenerator["default"].wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:context = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};_context.prev = 1;

            params = {
              workspaceId: process.env.WORKSPACE_ID,
              input: { text: text || '' },
              context: context };_context.next = 5;return (


              assistant.message(params));case 5:response = _context.sent;
            result = response.result;if (!

            (0, _ramda.prop)('nodes_visited', result.output)) {_context.next = 14;break;}
            dialogNode = result.output.nodes_visited[result.output.nodes_visited.length - 1];_context.next = 11;return (

              assistant.getDialogNode({
                workspaceId: process.env.WORKSPACE_ID,
                dialogNode: dialogNode }));case 11:dialog = _context.sent;


            result.output.title = dialog.result.title;

            dialog.result.output.generic.forEach(function (generic) {
              if ((0, _ramda.prop)('options', generic)) {
                result.output.options = generic.options;
              }
            });case 14:return _context.abrupt("return",



            result);case 17:_context.prev = 17;_context.t0 = _context["catch"](1);throw (

              new Error(_context.t0.status));case 20:case "end":return _context.stop();}}}, _callee, null, [[1, 17]]);}));return function message_bot(_x) {return _ref.apply(this, arguments);};}();



app.post('/conversation/', function (req, res) {var _req$body =
  req.body,text = _req$body.text,_req$body$context = _req$body.context,context = _req$body$context === void 0 ? {} : _req$body$context;
  message_bot(text, context).
  then(function (response) {
    res.status(200).json(response);
  })["catch"](
  function (err) {return res.status(500).json(err);});

});



app.listen(port, function () {return console.log("Running on port ".concat(port));});