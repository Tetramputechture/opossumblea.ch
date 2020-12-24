var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var opossums = JSON.parse(this.responseText);
    var opossum = opossums[Math.floor(Math.random() * opossums.length)];
    var opossumEl = document.getElementById('opossum');
    opossumEl.src = opossum.src;
    opossumEl.alt = opossum.alt;
    opossumEl.title = opossum.alt;
  }
};
xmlhttp.open("GET", "https://s3.amazonaws.com/opossumblea.ch/opossums.json", true);
xmlhttp.send();