//requirements
const express = require("express");
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const fs = require("fs").promise;
const { google } = require("googleapis");

const port = 8080;

//gmail auth scopes
const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://mail.google.com/"
];

//label to be created
const labelName = "Vacay Auto-Reply";

app.get("/", async (req, res) => {

    //taking Gmail authentication
    const auth = await authenticate({
        keyfilePath: path.join(__dirname, "credentials.json"),
        scopes: SCOPES,
    });

    //console.log(auth)

    //getting authorized gmail id
    const gmail = google.gmail({ version: "v1", auth });

    //finding all the labels available on gmail a/c
    const response = await gmail.users.labels.list({
        userId: "me",
    });

    //finding all the unseen and unreplied mails
    async function getUnrepliesMessages(auth) {
        const gmail = google.gmail({ version: "v1", auth });
        const response = await gmail.users.messages.list({
            userId: "me",
            labelIds: ["INBOX"],
            q: "is:unread",
        });

        return response.data.messages || [];
    }

    //generating the labelID
    async function createLabel(auth) {
        const gmail = google.gmail({ version: "v1", auth });
        try {
            const response = await gmail.users.labels.create({
                userId: "me",
                requestBody: {
                    name: labelName,
                    labelListVisibility: "labelShow",
                    messageListVisibility: "show",
                },
            });
            return response.data.id;
        } catch (error) {
            if(error.code === 409) {
                const response = await gmail.users.labels.list({
                    userId: "me",
                });
                const label = response.data.labels.find(
                    (label) => label.name === labelName
                );
                return label.id;
            } else{
                throw error;
            }
        }
    }

    async function main() {
        //create label for the app
        const labelId = await createLabel(auth);
        //console.log(labelId);


        //repeating in random intervals
        setInterval(async () => {

            //get messages that have no prior reply
            const messages = await getUnrepliesMessages(auth);
            //console.log(messages);

            //Checking if there is any mail that did not get any reply
            if(messages && messages.length > 0) {
                for(const message of messages) {
                    const messageData = await gmail.users.messages.get({
                        auth,
                        userId: "me",
                        id: message.id,
                    });

                    const email = messageData.data;
                    const hasReplied = email.payload.headers.some(
                        (header) => header.name === "In-Reply-To"
                    );

                    if(!hasReplied) {

                        //templating the reply message
                        const replyMessage = {
                            userId: "me",
                            resource: {
                                raw: Buffer.from(
                                    `To: ${
                                        email.payload.headers.find(
                                            (header) => header.name === "From"
                                        ).value
                                    }\r\n` +
                                    `Subject: Re: ${
                                        email.payload.headers.find(
                                            (header) => header.name === "Subject"
                                        ).value
                                    }\r\n` +
                                    `Content-Type: text/plain; charset="UTF=8"\r\n` +
                                    `Content-Transfer-Encoding: 7bit\r\n\r\n` +
                                    `Thank you for your email. I'm currently on vacation and will reply to you when I return.\r\n`
                                ).toString("base64"),
                            },
                        };
                        //sending the reply message
                        await gmail.users.messages.send(replyMessage);

                        //add label and move the mail to the label section
                        gmail.users.messages.modify({
                            auth,
                            userId: "me",
                            id: message.id,
                            resource: {
                                addLabelIds: [labelId],
                                removeLabelIds: ["INBOX"],
                            },
                        }); 
                    }
                }
            }
        }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
    }

    main();
    
    res.json({"this is Auth": auth});

});

app.listen(port, () => {
    console.log(`server is running ${port}`);
});