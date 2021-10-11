document.addEventListener("DOMContentLoaded", async () => {
  const s3 = new AWS.S3({ region: 'us-east-1' })

  // the <img> element displaying the opossum
  const OPOSSUM_EL = document.getElementById("opossum");

  // the <audio> element for opossum.mp3
  const TUNES_EL = document.getElementById("tunes");

  // the <button> element for playing tunes
  const TUNES_BUTTON = document.getElementById("tunes-button");

  // the <i> element that displays the tunes button icon
  const TUNES_ICON = document.getElementById("tunes-icon");

  // the <a> tag the user can click to conjure a new opossum
  const NEXT_POSSUM_EL = document.getElementById("next-opossum");

  // keep track of the last  opossum indexes, make sure we don't
  // display any of them (ensures fresh opossums)
  const PREVIOUS_OPOSSUM_MAX = 5;
  const previousOpossumIndexes = [];

  let opossums = []
  s3.listObjectsV2({ Bucket: 'opossumblea.ch', Prefix: 'opossums/' }, (err, data) => { 
    if (err) {
      console.log(err)
    } else {
      opossums = data.Contents;

      conjureOpossum();
      // setinterval for new possums
      let timer = setInterval(conjureOpossum, 4500);

      // configure next opossum button to conjure a new opossum
      NEXT_POSSUM_EL.addEventListener("click", () => {
        clearInterval(timer);
        timer = setInterval(conjureOpossum, 4500)
        conjureOpossum();
      });
    }
  })

  // toggle tunes on or off
  function toggleTunes() {
    const PAUSE_ICON_CLASS = 'la-volume-mute';
    const PLAY_ICON_CLASS = 'la-volume-up';

    if (TUNES_EL.paused) {
      // play tunes
      TUNES_ICON.classList.remove(PAUSE_ICON_CLASS);
      TUNES_ICON.classList.add(PLAY_ICON_CLASS);
      TUNES_BUTTON.title = 'nice. mute tunes?';
      TUNES_EL.load();
      TUNES_EL.play();
    } else {
      // pause tunes
      TUNES_ICON.classList.remove(PLAY_ICON_CLASS);
      TUNES_ICON.classList.add(PAUSE_ICON_CLASS);
      TUNES_BUTTON.title = 'tunes?';
      TUNES_EL.pause();
    }
  }

  // tunes default to muted
  // theres no reliable way to get autoplay
  // in all browsers
  TUNES_EL.defaultMuted = true;

  // configure tunes button to toggle tunes on or off
  TUNES_BUTTON.addEventListener("click", toggleTunes);

  // pick a random opossum from a list of opossums
  // and display it on the page
  async function conjureOpossum() {
    // choose an opossum index that is not included in the
    // last five opossum indexes
    let opossumIndex = Math.floor(Math.random() * opossums.length);
    while (previousOpossumIndexes.indexOf(opossumIndex) !== -1) {
      opossumIndex = Math.floor(Math.random() * opossums.length);
    }
    previousOpossumIndexes.push(opossumIndex);
    
    // remove the first opossum index in the array,
    // since it has now been PREVIOUS_OPOSSUM_MAX + 1
    // opossums since it was last seen
    if (previousOpossumIndexes.length >= PREVIOUS_OPOSSUM_MAX) {
      previousOpossumIndexes.shift();
    }

    const opossum = opossums[opossumIndex];
    const headResponse = await s3.headObject({ Bucket: 'opossumblea.ch', Key: opossum.Key }).promise();
    const metadata = headResponse.Metadata;
    const title = metadata['x-amz-meta-opossum-alt'] || 'opossum';
    OPOSSUM_EL.src = "https://s3.amazonaws.com/opossumblea.ch/" + opossum.Key;
    OPOSSUM_EL.alt = title;
    OPOSSUM_EL.title = title;
  }
});
