var Item = (function(){

  var itemRender = "";

  function publicGetItemHtml(id, obj){

  itemRender= `<li class="renderItem" id="`+id+`">

              <div class="row carousel-row">
                      <div class="col-12 col-xs slide-row">
                          <div class="slide">


                            <!-- Wrapper for slides -->
                            <div class="carousel-inner">
                              <!--<div id="img`+id+`" class="item active"> REMOVED BUT CHECK ITEM MARGIN-->
                              <div id="img`+id+`">

                              </div>

                            </div>
                          </div>
                          <div class="slide-content">
                              <h4>`+ obj.title + `</h4>
                              <p>`+ obj.desc + `</p>
                          </div>
                          <div class="slide-footer" style="margin-left: 77%;">

                                  <button  data-target="#myModal" data-toggle="modal" class="btn btn-sm btn-success edit-me"><i class="fa fa-fw"></i>Edit Content</button>
                                  <button id="`+obj.key+`" class="btn btn-sm btn-danger deleteMe"><i class="fa fa-fw"></i>Delete</button>

                          </div>
                       </div>
                  </div>
               </li>`;

              return itemRender
    }

    // PUBLIC EXPORTS
    return{

      getItemHtml: publicGetItemHtml

    }

 })();
