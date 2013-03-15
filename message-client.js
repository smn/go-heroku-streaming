var http = require('http');
var events = require('events');

module.exports = MessageClient;

function MessageClient(account_key, access_token, conversation_key) {
    events.EventEmitter.call(this);
    this.hostname = 'go.vumi.org';
    this.port = 80;
    this.account_key = account_key;
    this.access_token = access_token;
    this.conversation_key = conversation_key;
    this.path = ('/api/v1/go/http_api/' + this.conversation_key +
                    '/messages.json');
    this.auth = this.account_key + ':' + this.access_token;
    return this;
}

MessageClient.prototype = Object.create(events.EventEmitter.prototype);

MessageClient.prototype.start = function() {
    var options = {
        hostname: this.hostname,
        port: this.port,
        path: this.path,
        method: 'GET',
        auth: this.auth
    };
    var self = this;

    this.connection = http.request(options, function(resp) {
        buffer = '';
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            buffer += chunk.toString('utf8');
            buffer = self.parse_buffer(buffer);
        });
    });
    this.connection.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });
    this.connection.end();
};
    
MessageClient.prototype.parse_buffer = function(buffer) {
    var newline_pos = buffer.indexOf('\n');
    if(newline_pos >= 0) {
        json_data = buffer.substr(0, newline_pos);
        new_buffer = buffer.substr(newline_pos + 1, buffer.length);
        this.emit('message', JSON.parse(json_data));
        return new_buffer;
    }
    return buffer;
};

MessageClient.prototype.reply_to = function(message, content, end_session) {

    var body = JSON.stringify({
        in_reply_to: message.message_id,
        session_event: end_session ? 'close': 'resume',
        content: content
    });

    var options = {
        hostname: this.hostname,
        port: this.port,
        path: this.path,
        method: 'PUT',
        auth: this.auth,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': body.length
        }
    };

    var req = http.request(options);
    req.write(body);
    req.end();
};
