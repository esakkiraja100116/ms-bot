// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, ActionTypes, MessageFactory, ShowTypingMiddleware } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            
            // showing typing status as a middle ware
            context.adapter.use(new ShowTypingMiddleware({
                showTyping: true,
                clearInterval: 1000
            }));

            // Simulate processing or generating the reply
            await new Promise(resolve => setTimeout(resolve, 2000));

            const replyText = `Echo: ${ context.activity.text }`;
            
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            // After the bot has responded send the suggested actions.
            // await this.sendSuggestedActions(context);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Send a welcome message along with suggested actions for the user to click.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                const welcomeMessage = `Welcome to suggestedActionsBot ${ activity.membersAdded[idx].name }. ` +
                    'This bot will introduce you to Suggested Actions. ' +
                    'Please select an option:';
                await turnContext.sendActivity(welcomeMessage);
                // await this.sendSuggestedActions(turnContext);
            }
        }
    }

    /**
     * Send suggested actions to the user.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */

    async sendSuggestedActions(turnContext) {
        const cardActions = [
            {
                type: ActionTypes.ShowImage,
                title: 'Learn more about docker',
                value: 'https://play-lh.googleusercontent.com/lzT7NnmEVq5CEPpdDAfFFJcvAW-Uf5Jts1Oef3z5hQQEX-koff_AA9PetclXycKfuiA=s48-rw',
                image: 'https://play-lh.googleusercontent.com/lzT7NnmEVq5CEPpdDAfFFJcvAW-Uf5Jts1Oef3z5hQQEX-koff_AA9PetclXycKfuiA=s48-rw',
                imageAltText: 'R'
            }
            
        ];

        var reply = MessageFactory.suggestedActions(cardActions, 'Do you like about docker ?');
        await turnContext.sendActivity(reply);
    }
}

module.exports.EchoBot = EchoBot;
