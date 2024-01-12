A Node.js based app that is able to respond to emails sent to your Gmail mailbox while you’re out on a vacation.



********** WHAT THE APP DOES? ************

        • The app checks for new emails in a given Gmail ID
        • The app sends replies to Emails that have no prior replies
        • The app adds a Label to the email and move the email to the label
        • The app repeats this sequence of steps 1-3 in random intervals of 45 to 120 seconds


********** TECHNOLOGY USED ***********

        • Google APIs
        • Node.js
        • New JS syntax ( let, const, promises, etc)
        • npm libraries used :-

            -> express : Fast, unopinionated, minimalist web framework for Node.js.
            -> @google-cloud/local-auth : This library is meant to demonstrate authentication for sample purposes; 
                                          it should be treated as a starting point for building an application, 
                                          and is not a general purpose solution.
            -> google-auth-library : This is Google's officially supported node.js client library for using 
                                    OAuth 2.0 authorization and authentication with Google APIs.
            -> googleapis : Node.js client library for using Google APIs. 
                            Support for authorization and authentication with OAuth 2.0, API Keys and JWT tokens is included.
            -> node-cron : The node-cron module is tiny task scheduler in pure JavaScript for node.js based on GNU crontab. 
                          This module allows you to schedule task in node.js using full crontab syntax.
            -> path : This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
            -> fs : Old version of 'fs-extra'.


***************** SCOPE FOR IMPROVEMENT *****************

    • For starters, fs-extra can be used instead of fs.
    • Secondly, we are just replying with one automated message saying that "hey, I am on vacation".
          Later, we can add on to it by replying with some prdefined set of messages.
          Example: -> For a "Happy Birthday" mail we can reply back with a "Thank You" mail.
                   -> For "Urgent: call" mail we can reply back with "Hey, I am on a vacation message".
