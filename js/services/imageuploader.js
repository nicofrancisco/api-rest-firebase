var ImgUploader = (function(){

  // our path to Firebase
  var config = {
    apiKey: "AIzaSyCshwAO65369Zj2-unWbzV6I0IUexIHoi4",
    authDomain: "testlist-5baab.firebaseapp.com",
    databaseURL: "https://testlist-5baab.firebaseio.com",
    projectId: "testlist-5baab",
    storageBucket: "testlist-5baab.appspot.com",
    messagingSenderId: "559839258085"
  };

  firebase.initializeApp(config);

  var spinner = new Spinner({color: '#ddd'});
  var firebaseRef = 'testlist-5baab.appspot.com/';

  var storage = firebase.storage();

  var filePayload = {};
  var is_ready_for_new = false;


  // RETURN CURRENT REFERENCE TO IMAGE
  function publicGetImage(){

      return filePayload;
  }

  function publicSetImage(img){

      filePayload = img;
  }



  function handleFileSelect(evt) {
    
    var f = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      //uploadImage(theFile);
      return function(e) {
        filePayload = e.target.result;

        // Generate a location
        var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));

        var fotosDB = firebase.database().ref(hash + '/filePayload');
        spinner.spin(document.getElementById('spin'));
        // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
        fotosDB.set(filePayload, function() {
          spinner.stop();
          document.getElementById("pano").src = e.target.result;

          $('#file-upload').hide();

        });
      };
    })(f);
    reader.readAsDataURL(f);
  }

  $(document).on('itemAddedSuccess', function(customEvent, originalEvent, data) {

    $('#file-upload').show();
    document.getElementById("pano").src = "";
    //document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);


  });


  $(function() {
    $('#spin').append(spinner);
    var idx = window.location.href.indexOf('#');
    var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
    if (hash === '') {

      // No hash found, so render the file upload button.

      document.getElementById("file-upload").style.visibility = "visible";
      document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);
    } else {
      // A hash was passed in, so let's retrieve and render it.
      spinner.spin(document.getElementById('spin'));

      console.log("behavior changed");

      var fotosDB = firebase.database().ref(hash + '/filePayload');


      fotosDB.once('value', function(snap) {
        var payload = snap.val();
        if (payload != null) {
          document.getElementById("pano").src = payload;
        } else {
          $('#body').append("Not found");
        }
        spinner.stop();
      });
    }
  });

  return{

    getImage: publicGetImage,
    setImage: publicSetImage

  }



})();
