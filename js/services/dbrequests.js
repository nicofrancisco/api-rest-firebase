var DbService = (function (){


  var itemsDB = firebase.database().ref("items");
  var myData = itemsDB.child("items");

  ImgUploader;


  privateGetFromDB();
  var dbData = [];


  function publicGetDataFromDB(){

      return dbData.splice();
  }

  function privateGetFromDB(){

          $.ajax({
             url: 'https://testlist-5baab.firebaseio.com/items.json',
            /*  data: {
                   format: ''
            },*/
             error: function(e) {

             },
             dataType: 'jsonp',
             success: function(data) {

                dbData = data;
                $(document).triggerHandler('dbSuccess', [{}, dbData ]);

             },
             type: 'GET'
          });
  }

  function publicAddToDB(item, timeStamp){

            myData.child(timeStamp).set({
              desc: item.desc,
              img: item.img,
              title: item.title,
            });

  }



  function publicRemoveFromDB(index){

              myData.child(index).remove();
              $(document).triggerHandler('REMOVED_ITEM', [{}, dbData ]);
  }

  function publicUpdateItemFromDB(id, item){


          myData.child(id).set({
          desc: item.desc,
          img: item.img,
          title: item.title

       });

       /*req.once('value', function(snapshot) {

            $(document).triggerHandler('ItemUpdatedEvent', [{}, {current: currentID} ]);

       });*/

  }


  function publicListOrderFromDB(currentIdDB, updatedIdDB){


        var currentchild = myData.child(currentIdDB);
        currentchild.once('value', function(snapshot) {
        snap = snapshot.val();

        var force = Math.floor((Math.random() * 50) + 1);
        updatedID = updatedIdDB+force;
        $(document).triggerHandler('ListOrderUpdatedItem', [{}, {updated: updatedID} ]);

        myData.child(updatedID).set({
          desc: snap.desc,
          img: snap.img,
          title: snap.title

        });

        currentchild.remove();

      });


      var updatedchild = myData.child(updatedIdDB);
      updatedchild.once('value', function(snapshot) {
        snap2 = snapshot.val();

        var force = Math.floor((Math.random() * 50) + 1);
        currentID = currentIdDB+force;
        $(document).triggerHandler('ListOrderCurrentItem', [{}, {current: currentID} ]);

        myData.child(currentID).set({
          desc: snap2.desc,
          img: snap2.img,
          title: snap2.title

        });

        updatedchild.remove();

      });

  }

  // PUBLIC EXPORTS
  return{

      getDBData : publicGetDataFromDB,
      addDBData : publicAddToDB,
      removeDBData : publicRemoveFromDB,
      updateDBListOrder : publicListOrderFromDB,
      updateDBItem: publicUpdateItemFromDB

  }

})();
