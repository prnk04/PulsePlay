import * as spotifyCred from '../auth/spotify.json'

export async function spotifyLogin() {
    try {

        console.log("I am inside spotify login")
        let clientId = spotifyCred.spotifyCredentials.clientId
        let clientSecret = spotifyCred.spotifyCredentials.clientSecret

        // var details = {
        //     'grant_type': 'client_credentials',
        //     'client_id': clientId,
        //     'client_secret': clientSecret
        // };

        // var formBody = [];
        // for (var property in details) {
        //     var encodedKey = encodeURIComponent(property);
        //     var encodedValue = encodeURIComponent(details[property]);
        //     formBody.push(encodedKey + "=" + encodedValue);
        // }
        // let newformBody = formBody.join("&");
        // console.log("form body: ", newformBody)

        // let authResponse = await fetch(
        //     "https://accounts.spotify.com/api/token",
        //     {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/x-www-form-urlencoded"
        //         },
        //         body: newformBody
        //     }
        // )

        // console.log("response is: ", authResponse)

        // try {
        //     let jsonRes = await authResponse.json()

        //     console.log("json res: ", jsonRes);

        //     return jsonRes;
        // } catch (error) {
        //     console.log("No JSON response")
        // }

        var redirect_uri = 'http://localhost:8888/callback';

        var state = "ABc134567frghv";

        
        var scope = 'user-read-private user-read-email';

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(clientId);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);
        url += '&show_dialog=' + encodeURIComponent(true);

        let apiRes = await fetch(url)

        console.log("api res: ", apiRes)

        let apiJSON = await apiRes.json();

        console.log("api json: ", apiJSON)

    } catch (error) {
        console.log("Error while authenticating: ", error)
    }
}

