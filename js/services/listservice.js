
var ListService = (function(){


     var itemList = [];
     var keys = [];
     var counter;


     // LISTEN TO DB DATA SUCCES
     //DATA FORMAT:
     //           items= [{title: "Test", desc: "Lorem Ipsum"},
     //                  {title: "Test 2", desc: "Lorem Ipsum"}];

     $(document).on('dbSuccess', function(customEvent, originalEvent, data) {

       keys = Object.keys(data.items);
       itemList = Object.keys(data.items).map(function (key) { return data.items[key]; });

       counter = itemList.length;

       for(var a = 0; a < counter; a ++){
          itemList[a].key = keys[a];
       }
     });



    function publicGetCounter(){

        return counter;
    }

    function publicGetItems(){

        return itemList.slice();
    }

    function publicAddItems(item, timeStamp){


            counter++
            itemList.push(item);

            DbService.addDBData(item, timeStamp)

    }

    function publicUpdateListOrder(currentId, updatedId){


            DbService.updateDBListOrder(currentId, updatedId);

            //this.itemsChanged.next(this.recipes.slice()); UPDATE DB NEXT STEP..
    }

    function publicUpdateItem(id, item){

            //itemList[index] = item;
            DbService.updateDBItem(id, item)
            // render html and dbase;

    }



    function publicDeleteItem(index){

            itemList.splice(index, 1);
            counter--;

            DbService.removeDBData(index);

            //this.itemsChanged.next(this.recipes.slice()); UPDATE DB NEXT STEP..

    }

    // PUBLIC EXPORTS
    return {

        getCounter: publicGetCounter,
        getItems: publicGetItems,
        addItem : publicAddItems,
        removeItem: publicDeleteItem,
        updateItem: publicUpdateItem,
        updateListOrder: publicUpdateListOrder


    }


})();
