go-heroku-streaming
===================

Sample Node.js app using Vumi Go's streaming HTTP API.

::

	$ heroku login
	$ heroku create
	$ git push heroku master
	$ heroku config:add GO_ACCESS_TOKEN=<access-token> \
		GO_ACCOUNT_KEY=<account-key> \
		GO_CONVERSATION_KEY=<conv-key>
	$ heroku ps:scale worker=1
	$ heroku log -t