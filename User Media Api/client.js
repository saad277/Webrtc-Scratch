

var stream;




navigator.getUserMedia({ video: true, audio: true }, (s) => {

    let video = document.querySelector("video")

    stream = s

    video.srcObject = stream;
    video.play();



}, (err) => {

    console.log(err)
})


const btnGetAudioTracks = document.querySelector("#btnGetAudioTracks")
const btnTrackById = document.querySelector("#btnTrackById")
const btnGetVideoTracks = document.querySelector("#btnGetVideoTracks")
const btnRemoveAudioTrack = document.querySelector("#btnRemoveAudioTrack")
const btnRemoveVideoTrack = document.querySelector("#btnRemoveVideoTrack")


btnGetAudioTracks.addEventListener("click", () => {


    console.log("Get Audio Tracks")
    console.log(stream.getAudioTracks())
})


btnTrackById.addEventListener("click", () => {

    console.log("Track By Id")
    console.log(stream.getTrackById(stream.getAudioTracks()[0].id))
})

btnGetTracks.addEventListener("click", () => {

    console.log("Get Tracks")
    console.log(stream.getTracks())
})

btnGetVideoTracks.addEventListener("click", () => {


    console.log("Get Video Tracks")
    console.log(stream.getVideoTracks())
})

btnRemoveAudioTrack.addEventListener("click", () => {

    console.log("Remove Audio Track")
    stream.removeTrack(stream.getAudioTracks()[0])
})


btnRemoveVideoTrack.addEventListener("click", () => {

    console.log("Remove Video Track")
    stream.removeTrack(stream.getVideoTracks()[0])
})
