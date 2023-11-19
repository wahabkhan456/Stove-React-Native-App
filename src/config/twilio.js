import { Client } from "twilio-chat";

export const initializeTwilioForGroup = async (clientName, clientId) => {
    let clientResponse = await fetch(`https://us-central1-stove-e851c.cloudfunctions.net/chatToken`, {
        method: "POST",
        body: JSON.stringify({
            id: clientName
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let clientData = await clientResponse.json();
    let client = await Client.create(clientData.token);
    try {
        let checkUserExist = await client.getSubscribedChannels();

        if (checkUserExist.items.find(e => e.uniqueName === `group-${clientId}`)) return { client: client, channel: client.getChannelByUniqueName(`group-${clientId}`) };

        console.log('Joining chat client');
        let channel = await client.getChannelByUniqueName(`group-${clientId}`);
        await channel.join();

        // when the access token is about to expire, refresh it
        client.on('tokenAboutToExpire', function () {
            refreshToken(clientData.identity, client.updateToken);
        });

        // if the access token already expired, refresh it
        client.on('tokenExpired', function () {
            refreshToken(clientData.identity, client.updateToken);
        });

        return { client: client, channel: client.getChannelByUniqueName(`group-${clientId}`) };
    } catch (error) {
        if (error.message === "Not Found") {
            console.log('Created chat client');
            let channel = await createNewChannel(client, `group-${clientId}`);
            await channel.join();
            return { client: client, channel: client.getChannelByUniqueName(`group-${clientId}`) };
        }
    }
}

export const initializeTwilioForPM = async (client, channelId) => {
    try {
        let checkUserExist = await client.getSubscribedChannels();
    
        if (checkUserExist.items.find(e => e.uniqueName === `pm-${channelId}`)) return client.getChannelByUniqueName(`pm-${channelId}`);
        
        console.log('Joining private channel chat');
        let channel = await client.getChannelByUniqueName(`pm-${channelId}`);
        await channel.join();
    
        return client.getChannelByUniqueName(`pm-${channelId}`);
    } catch(err) {
        if(err.message === "Not Found") {
            console.log('Created private channel chat');
            let channel = await createNewChannel(client, `pm-${channelId}`);
            await channel.join();
            
            return client.getChannelByUniqueName(`pm-${channelId}`);
        }
    }
};

const refreshToken = async (identity, updateToken) => {
    console.log('Token about to expire', identity);
    // Make a secure request to your backend to retrieve a refreshed access token.
    // Use an authentication mechanism to prevent token exposure to 3rd parties.
    let clientResponse = await fetch(`https://us-central1-stove-e851c.cloudfunctions.net/chatToken`, {
        method: "POST",
        body: JSON.stringify({
            id: identity
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
    );
    let clientData = await clientResponse.json();
    console.log('updated token for chat client');
    updateToken(clientData.token);

}

const createNewChannel = (client, channelName) => {
    return client.createChannel({
        uniqueName: channelName,
        friendlyName: `${channelName} Chat Channel`
    });
}