const c = require('centra');
const http = require('https');
const fs = require('fs');
const url = "https://api.classplusapp.com";
const download = require('download');
const readlineSync = require('readline-sync');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  

class downloader{
    async login(email){
        const response = await c(url,"POST").path("v2/otp/generate").body({
            email,
            "viaEmail": 1,
            "orgId": 13146,
        },'json').send();
        
        if(response.statusCode===200) {
            let data = await response.json();
            this.sessionId = data.data.sessionId;
            let otp = readlineSync.question("Enter OTP: ");
            const resp = await c(url,"POST").path("v2/users/verify").body({
                email,
                "viaEmail": 1,
                "orgId": 13146,
                otp,
                "sessionId":this.sessionId
            },'json').send();
            if(resp.statusCode==200){
                const data = await resp.json();
                this.token = data.data.token;
                console.log(this.token);
                this.refreshToken = data.data.refreshToken;
                console.log(this.refreshToken); //IDK WHAT TO DO WITH THIS RIGHT NOW LETS KEEP IT FOR FUTURE
                console.log("Login Successful")
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }

    async getAllVideos(){
        
        const respgionse = await c(url).path("v2/videos/folder/").header({
            "x-access-token": this.token
        }).send();

        if(response.statusCode===200) {
            const data = await response.json();
            return data.data;
        }
    }


}
async function getAllDownloadLinks(){
    let manager = new downloader();
    if((await manager.login("benero6658@tmauv.com"))){
        let videodata = await manager.getAllVideos();
        console.log(videodata);
    }else{
        console.log("Couldn't login")
    }
    // let list = [];
    // const videolist = await manager.getAllVideos(0,999);
    // for(video of videolist){
    //     const url = await manager.getURlfromKey(video.url);
    //     list.push([url,video.subject+"-"+video.updatedAt]);
    // }

    // for(x in list){
    //     console.log(`Downloading ${x} ${list[x][1]+".mp4"}`)
    //     //const file = fs.createWriteStream(a[x][1]+".mp4");
    //     //const request = http.get(a[x][0], function(response) {
    //     //    response.pipe(file);
    //     //    console.log("Done "+a[x][1]);
        
    //     //});
    //     fs.writeFileSync(list[x][1]+".mp4", await (download(list[x][0])) );
    //     console.log("done");
    //}
}
getAllDownloadLinks()

