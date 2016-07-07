
function profile_edit_init(){
    $.ajax({
      url: "/api/admin/user/"
    }).done(function(data) {
        $('#dataForm').html(new EJS({url : "/admin/template/userEdit.ejs"}).render(data));
    }); 
}    


function profile_edit_formSubmit(){
    $('#dataForm').submit(function(event) { 
        var msg_action=$('#msg_action');
        
        if(userName==''){
             msg_action.html("please input name"); 
        }else if($('#password').val()!=$('#confirmPassword]').val() ){
             msg_action.html("please confirm password"); 
        }else{
            $.ajax({
                type        : ('PUT'),  
                url         : '/api/admin/user/', 
                data        : $(this).serialize(),  
                dataType    : 'json', 
                encode      : true
            }).done(function(data) { 
                msg_action.html(data.message); 
            });
        }
        
        event.preventDefault(); 
    });
    
} 



function item_edit_init(id){
    $.ajax({
      url: "/api/admin/item/"+id
    }).done(function(data) {
        var dataForm = document.getElementById('dataForm'); 
        dataForm.innerHTML = new EJS({
            url : "/admin/template/itemEdit.ejs"   
        }).render(data);
       
        initBTS(data.item.locationId);
        initProvinces(data.item.provinceId,data.item.cityId);
         
    }); 
}    
  

function item_edit_formSubmit(id){
    $('form').submit(function(event) {
 
        var formData = {
            'id'                : $('input[name=id]').val(),
            'nameThai'          : $('input[name=nameThai]').val(),
            'nameEnglish'       : $('input[name=nameEnglish]').val(),
            'nameChinese'       : $('input[name=nameChinese]').val(),
            'minPrice'          : $('input[name=minPrice]').val(),
            'maxPrice'          : $('input[name=maxPrice]').val(),
            'spaceSize'         : $('input[name=spaceSize]').val(),
            'houseType'         : $('input[name=houseType]').val(),
            'rentType'          : $('input[name=rentType]').val(),
            'floor'             : $('input[name=floor]').val(),
            'totalFloor'        : $('input[name=totalFloor]').val(),
            'locationId'        : $('input[name=locationId]').val(),
            'provinceId'        : $('input[name=provinceId]').val(),
            'cityId'            : $('input[name=cityId]').val(),
            'address'           : $('input[name=address]').val(),
            'rentLimit'         : $('input[name=rentLimit]').val(),
            'status'            : $('input[name=status]').val(),
            'updaterId'         : $('input[name=updaterId]').val()  ,
            'itemUnit_name'          : $('input[name=itemUnit_name]').val()  ,
            'itemUnit_roomQuantity'  : $('input[name=itemUnit_roomQuantity]').val() 
            
        };
          
        $.ajax({
            type        : (id?'PUT':'POST'),  
            url         : '/api/admin/item/'+id, 
            data        : $('#dataForm').serialize(),  
            dataType    : 'json', 
            encode      : true
        }).done(function(data) { 
                $('#msg_action').html(data.message);
            
                
        });
  
        
        event.preventDefault();
        
      
    });
    
} 

function item_edit_addItemUnit(){           
    $('#itemUnits').append($('#def_itemUnit').html().replace('<table>','').replace('</table>','').replace('<tbody>','').replace('</tbody>',''));
}   


var itemPage = 0;
function loadMyItems(){
    $.get( "/api/admin/items/", { page:++itemPage} )
    .done(function( data ) {
        $('#rooms').append(new EJS({url : "/admin/template/items.ejs"}).render(data));
    });
}    

 
