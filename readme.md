# try-catch loader

## What is it?

A Webpack loader that wraps required JS in a try/catch.

## Why would I use that?

Some client-side JS libraries don't like being loaded on the server -
ones that do something like check `navigator.userAgent` when loading,
for example. This causes problems when you're trying to do server-side
rendering of a React component (for example) as the require statement
will fail.

## What doesn't it do?

Fix the library. It'll just cause the require statement
to return null, so the module will be inaccessible. You either need it to 
be inside a function that doesn't get run on the server, or wrap it in an 
if statement that checks what it is.

## Give me an example

Fine. Consider the following React component:

    var someClientsideLibrary = require('some-client-side-library);
    var React = require('react');

    module.exports = React.createClass({
        render: function() {
            return <div>Hello.</div>
        },
        componentDidMount: function() {
            someClientsideLibrary.doThing(this.findDOMNode());
        }
    })

If `someClientsideLibrary` uses `document`, `navigator`, `window` etc. on
load it will break any attempt at server-side rendering of this component.
When wrapped in `try-catch` it won't - it will just return null. Normally
that would be a problem, but server-side rendered React components never
run `componentDidMount` (instead running it client-side on load), so the
render won't actually throw an error.

## How do I use it?

Glad you asked. I recommend not hard-coding this in your webpack config,
as try/catching every library will add a performance penalty. Instead,
add it in the require statement, like so:

    require("try-catch!a-troublesome-library");
    
Then submit a pull request to that library with a suggestion on how to
make it server friendly (like, moving the use of `window` to the first time
the library is used rather than when it is loaded).