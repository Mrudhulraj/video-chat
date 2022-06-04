const APP_ID='f3a636ad9a974a87963b88050232f670'
const CHANNEL='main'
const TOKEN= '006f3a636ad9a974a87963b88050232f670IABhJPZf5NroO1P8SPd1Wx8L64l6iTJWKbAGu7/fWvqVr2TNKL8AAAAAEACjPQT8FN+SYgEAAQAV35Ji'
let UID;

const client= AgoraRTC.createClient({mode: 'rtc', codec:'vp8'})

let localTracks=[]
let remoteUsers={}

let joinAndDisplayLocalStream = async() =>{
    client.on('user-published',handleUserJoined)
    client.on('user-left',handleUserLeft)
    UID=await client.join(APP_ID,CHANNEL,TOKEN,null)
    localTracks=await AgoraRTC.createMicrophoneAndCameraTracks()

    let player=`<div class="video-container" id="user-container-${UID}">
    <div class="username-wrapper"><span class="user-name"> My name</span></div>
    <div class="video-player" id="user-${UID}"></div>
    </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0],localTracks[1]])
}

let handleUserJoined= async (user,mediaType)=>{
    remoteUsers[user.uid]=user
    await client.subscribe(user,mediaType)

    if(mediaType==='video'){
        let player= document.getElementById(`user-container-${user.uid}`)
        if(player!=NULL){
            player.remove()
        }

        player=`<div class="video-container" id="user-container-${UID}">
    <div class="username-wrapper"><span class="user-name"> My name</span></div>
    <div class="video-player" id="user-${user.uid}}"></div>
    </div>`
    document.getElementById('video').insertAdjacentHTML('beforeend',player)
        user.videoTrack.play(`user-${user.id}`)
    }

    if(mediaType==='audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft=async(user)=>{
    delete remoteUsers[user.uid]
    document.getElementById('user-container-${user.uid}').remove()
}

let leaveAndRemoveLocalStream=async() =>{
     for(let i=0;i< localTracks.length;i++){
         localTracks[i].stop();
         localTracks[i].close();
     }
     await client.leave();
     window.open('/','_self');
}

let toggleCamera = async() =>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor='#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor="rgb(255,80,80,1)"
    }
}

let toggleMic = async() =>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor='#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor="rgb(255,80,80,1)"
    }
}

joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMic)