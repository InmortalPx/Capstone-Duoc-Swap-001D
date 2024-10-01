function selectImage() {
  document.getElementById('image-upload').click();
}

document.getElementById('image-upload').onchange = function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onload = function() {
  document.getElementById('add-picture').src = reader.result;
  };
  reader.readAsDataURL(file);
};

