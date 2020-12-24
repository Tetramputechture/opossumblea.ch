// the list of all opossums
// as a JSON array with the example structure:
// {
//   "src": "opossums/curled-opossum-1.jpeg",
//   "alt": "asleep and dreaming possum curls up in their comfy corner of hay"
// }
let opposums = [];

// the number of retries we have made to
// gather the list of opossums
let retries = 0;

// the max amount of retries we have to gather
// the list of opossums
const MAX_RETRIES = 3;

// the <img> element displaying the opossum
const OPPOSUM_EL = document.getElementById('opossum');

// set up xmlhttprequest to fetch and display opossum
const xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    opossums = JSON.parse(this.responseText);
    conjureOpossum(opossums);
  } else {
    if (retries < MAX_RETRIES) {
      retries++;
    } else {
      // always prefer presence of opossum rather than no opossum at all
      location.replace("error.html");
    }
  }
};
xmlhttp.open("GET", "https://s3.amazonaws.com/opossumblea.ch/opossums.json", true);

// prefer slower initial page loader and 
// faster subsequent opossums, so gather 
// all opossums on initial page load
xmlhttp.send();

function conjureOpossum()  {
  let opossum = opossums[Math.floor(Math.random() * opossums.length)];
  OPPOSUM_EL.src = opossum.src;
  OPPOSUM_EL.alt = opossum.alt;
  OPPOSUM_EL.title = opossum.alt;
}

