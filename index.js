document.addEventListener("DOMContentLoaded", async () => {
  // the link to our opposums
  const OPOSUMS_URL = "https://s3.amazonaws.com/opossumblea.ch/opossums.json";

  // the <img> element displaying the opossum
  const OPOSSUM_EL = document.getElementById("opossum");

  // the <audio> element for opossum.mp3
  const TUNES_EL = document.getElementById("tunes");

  // the <input type="button"> element for playing tunes
  const TUNES_BUTTON = document.getElementById("tunes-button");

  // the <a> tag the user can click to conjure a new opossum
  const NEXT_POSSUM_EL = document.getElementById("next-opossum");

  // fetch the list of all opossums
  // as a JSON array with the example structure:
  // {
  //   "src": "opossums/curled-opossum-1.jpeg",
  //   "alt": "asleep and dreaming opossum curls up in their comfy corner of hay"
  // }
  const response = await fetch(OPOSUMS_URL);
  const opossums = await response.json();

  // keep track of the last  opossum indexes, make sure we don't
  // display any of them (ensures fresh opossums)
  const PREVIOUS_OPOSSUM_MAX = 5;
  const previousOpossumIndexes = [];

  // pick a random opossum from a list of opossums
  // and display it on the page
  function conjureOpossum() {
    // choose an opossum index that is not included in the
    // last five opossum indexes
    let opossumIndex = Math.floor(Math.random() * opossums.length);
    while (previousOpossumIndexes.includes(opossumIndex)) {
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
    OPOSSUM_EL.src = opossum.src;
    OPOSSUM_EL.alt = opossum.alt;
    OPOSSUM_EL.title = opossum.alt;
  }

  // toggle tunes on or off
  function toggleTunes() {
    if (TUNES_EL.paused) {
      TUNES_BUTTON.value = "nice. mute tunes?";
      TUNES_BUTTON.textContent = "nice. mute tunes?";
      TUNES_EL.load();
      TUNES_EL.play();
    } else {
      TUNES_BUTTON.value = "opossum tunes?";
      TUNES_BUTTON.textContent = "opossum tunes?";
      TUNES_EL.pause();
    }
  }

  // tunes default to muted
  // theres no reliable way to get autoplay
  // in all browsers
  TUNES_EL.defaultMuted = true;

  // configure tunes button to toggle tunes on or off
  TUNES_BUTTON.addEventListener("click", toggleTunes);

  // configure next opossum button to conjure a new opossum
  NEXT_POSSUM_EL.addEventListener("click", () => conjureOpossum());

  // conjure first opossum
  conjureOpossum();

  // setinterval for new possums
  setInterval(conjureOpossum, 5000);
});
