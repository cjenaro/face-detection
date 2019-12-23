const wrapper = document.querySelector('.wrap')
const webcam = document.querySelector('.webcam')
const video = document.querySelector('.video')
const face = document.querySelector('.face')
const SIZE = 10
const SCALE = 1.5
const ctx = video.getContext('2d')
const faceCtx = face.getContext('2d')

if (!window.FaceDetector) {
  wrapper.innerHTML = `
    <h1>Your browser does not support Face Detector</h1>
  `
} else {
  const faceDetector = new window.FaceDetector()

  async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
    })

    webcam.srcObject = stream
    await webcam.play()

    video.width = webcam.videoWidth
    video.height = webcam.videoHeight
    face.width = webcam.videoWidth
    face.height = webcam.videoHeight
  }

  async function detect() {
    const faces = await faceDetector.detect(webcam).catch(() => {
      wrapper.innerHTML = `
        <h1>Your OS does not support Face Detector</h1>
      `
    })
    faces.forEach(censor)
    requestAnimationFrame(detect)
  }

  function censor({ boundingBox }) {
    faceCtx.imageSmoothingEnabled = false
    faceCtx.clearRect(0, 0, face.width, face.height)

    const width = boundingBox.width * SCALE
    const height = boundingBox.height * SCALE

    faceCtx.drawImage(
      webcam,
      boundingBox.x,
      boundingBox.y,
      width,
      height,
      boundingBox.x,
      boundingBox.y,
      SIZE,
      SIZE
    )

    faceCtx.drawImage(
      face,
      boundingBox.x,
      boundingBox.y,
      SIZE,
      SIZE,
      boundingBox.x - (width - boundingBox.width) / 2,
      boundingBox.y - (height - boundingBox.height) / 2,
      width,
      height
    )
  }

  populateVideo().then(detect)
}
