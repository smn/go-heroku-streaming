var message_client = require('./message-client');

var mc = new message_client(
    process.env.GO_ACCOUNT_KEY,
    process.env.GO_ACCESS_TOKEN,
    process.env.GO_CONVERSATION_KEY);

mc.on('message', function(message) {
    if(message.content) {
        mc.reply_to(message, 'thanks ' + message.content + '!', true);
    } else {
        mc.reply_to(message, 'Hi! What is your name?');
    }
});

mc.start();
