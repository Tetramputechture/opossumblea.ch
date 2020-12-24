var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var possums = JSON.parse(this.responseText);
    var possum = possums[Math.floor(Math.random() * possums.length)];
    var possumEl = document.getElementById('opossum');
    possumEl.src = possum.src;
    possumEl.alt = possum.alt;
  }
};
xmlhttp.open("GET", "https://s3.amazonaws.com/opossumblea.ch/opossums.json", true);
xmlhttp.send();