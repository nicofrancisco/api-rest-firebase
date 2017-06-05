$(document).ready(

    function(){

      var count = 0;
      // RENDER ITEM LIST
      function renderItems(){

        $.each( ListService.getItems(), function( key, value ) {

           //RENDER ITEMS
           $('ul').append(Item.getItemHtml(key, value));

           if($("#img"+key).children().length < 1){

                 var dbImage = '<img class="img-item" src='+ value.img +'></img>';
                 $("#img"+key).append(dbImage );
                 count++
           }
        });


        var title = "";
        var desc = "";
        var img = "";

        var titleObj = "";
        var descObj = "";
        var imgObj = "";

        var updatedImg;

        // MODAL EDIT SHOWS
        $(document).on('show.bs.modal','#myModal', function (event) {


          var element = $(event.relatedTarget);



          var index = $(element).closest('li').attr('id');
          var id_db = $(element.context.nextElementSibling).attr('id');

          title = $(element).parents().eq(index).find('.slide-content h4').text();//)
          desc = $(element).parents().eq(index).find('.slide-content p').text();//)
          img = $(element).parents().eq(index).find('.carousel-inner img').attr('src');

          titleObj = $(element).parents().eq(index).find('.slide-content h4');
          descObj = $(element).parents().eq(index).find('.slide-content p');
          imgObj = $(element).parents().eq(index).find('.carousel-inner img');


          var modal = $(this);
          $("#title").val(title);
          $("#description").val(desc);
          $("#panoPopUp").attr('src', img);

          document.getElementById('file-upload-modal').addEventListener('change', updateImage, false);


          function updateImage(evt) {


            var f = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {

              return function(e) {
                updatedImg = e.target.result;

                // Generate a location
                var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(updatedImg));

                var fotosUpdate = firebase.database().ref(hash + '/filePayload');

                // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
                fotosUpdate.set(updatedImg, function() {

                  document.getElementById("panoPopUp").src = e.target.result;

                  $('#file-upload-modal').hide();

                });
              };
            })(f);
            reader.readAsDataURL(f);
          }



          $("#modal-form").submit(function(e){
              e.preventDefault();



            var newdes = $(e.target).find('#description').val();
            var newtitle = $(e.target).find('#title').val();
            var newimg = $(e.target).find('#panoPopUp').val();



            $(titleObj).text(newtitle);
            $(descObj).text(newdes);
            $(imgObj).attr('src', updatedImg);


              var objItem = {
                  desc: newdes,
                  title: newtitle,
                  img: updatedImg
              }

              //Service call to update DB
              ListService.updateItem(id_db, objItem)

              $('#file-upload-modal').show();

              document.getElementById("panoPopUp").src = "";
              //document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);


            $('#myModal').modal('hide');

          });

        });
      }


        // MODAL EDIT HIDES
      $(document).on('hide.bs.modal', '#myModal', function (e) {

          title = "";
          desc = "";
          img = "";

      });


      //LISTEN TO DB SUCCESS
      $(document).on('dbSuccess', function(customEvent, originalEvent, data) {

           renderItems();
      });

      $(document).on('ItemUpdatedEvent', function(customEvent, originalEvent, data) {


      });



      $("#items-form").submit(function(e){
          e.preventDefault();
      });

      //
      // INTERACTION EVENTS USER
        $('#button-add').click(
            function(){

              var addTitle = $('input[name=list-item]').val();
              var addDesc = $('textarea[name=area-item]').val();
              var fixID = (ListService.getCounter());

              var time_stamp = Date.now();

              var objParams = {
                desc: addDesc,
                title: addTitle,
                key: time_stamp
              }

              if (addTitle === '' || addTitle === ' ') {
                  alert("You must write something to add!");
              } else {

                  //RENDER ITEM HTML
                 $('ul').append(Item.getItemHtml(fixID, objParams));

                  $('input[name=list-item]').val('');
                  $('textarea[name=area-item]').val('');

                  
                  //ADD image
                  if($("#img"+fixID).children().length < 1){

                      var myimage = ImgUploader.getImage();


                      var i = '<img class="img-item" src='+ myimage +'></img>';
                      $("#img"+fixID).append(i);
                  }



                  // ImageUploader listen to this to change view.


                 ListService.addItem({title: addTitle, desc: addDesc, img: myimage}, time_stamp);

                 $(document).triggerHandler('itemAddedSuccess', [{}, "message" ]);

              }
            });


            $(document).on("click",".deleteMe", function(){

                    $(this).closest("li").toggleClass('strike').fadeOut('slow', function() {
                          $(this).closest("li").remove();
                    });

                    ListService.removeItem($(this).closest("li").context.id);

            });




      $('input').focus(function() {
        $(this).val('');
      });


      var current_db_obj;
      var update_db_obj;

      $('ul').sortable({

        //containment: "parent", //OPTIONAL
        connectWith: 'ul',

        update: function (event, ui) {

              var item_swap_DB;

              var start_pos = ui.item.attr('id');//position of dragged

              var indexDB = $(ui.item).find( ".deleteMe" ).attr('id');

              var current_db_index = indexDB;
              current_db_obj = $(ui.item).find( ".deleteMe" );

              var sortedIDs = $('ul').sortable("toArray");
               // Iterate over all <li> elements

              var new_pos=((sortedIDs.slice().indexOf(start_pos)));

                if (start_pos < new_pos) {
                 //update the items before the re-ordered item
                  var first = 0;
                  for(var y=new_pos; y > 0; y--){


                        $(this).children().eq(y-1).attr('id', (y-1));

                        if(first === 0){
                              var update_db_index = $(this).children().eq(y-1).find( ".deleteMe" ).attr('id');
                              update_db_obj = $(this).children().eq(y-1).find( ".deleteMe" );

                              updateDataBase(current_db_index, update_db_index);
                        }

                        first++

                      }
                }
               else {
                //update the items after the re-ordered item
                      var first = 0;

                      for(var i=new_pos+2;i <= $('ul li').length; i++){

                          $(this).children().eq(i-1).attr('id', (i-1));


                          if(first === 0){
                                 var update_db = $(this).children().eq(i-1).find( ".deleteMe" ).attr('id');
                                 update_db_obj = $(this).children().eq(i-1).find( ".deleteMe" );


                                 updateDataBase(current_db_index, update_db);
                          }

                          first++
                      }
                   }
                },

                axis: 'y'


      });

      function updateDataBase(currentId_db, updateId_db){

          ListService.updateListOrder(currentId_db, updateId_db);

      }

      $(document).on('ListOrderCurrentItem', function(customEvent, originalEvent, data) {

           $(current_db_obj).attr('id', data.current);


      });

      $(document).on('ListOrderUpdatedItem', function(customEvent, originalEvent, data) {

           $(update_db_obj).attr('id', data.updated);


      });


});
