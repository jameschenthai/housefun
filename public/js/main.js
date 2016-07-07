var defaultPageCount = 2;

var searchPage = 0;
function doSearch(){ 
    $('#searchMsg').html('<image src="../images/loading.svg">');
   
 
    if(searchPage==0){
        $('#rooms').html('');
        $('#resultCountDIV').hide();
    }
     
    $.ajax({
      url: "/api/search/",
      data: { 
            provinceId: $('#provinceId').val(), 
            cityId : $('#cityId').val() , 
            houseType : $('#houseType').val() ,
            locationId : $('#locationId').val() ,
            keyword : $('#keyword').val(),
            minPrice : $('#queryMinPrice').val(),
            maxPrice : $('#queryMaxPrice').val(),
            page:++searchPage
      }
    }).done(function(data) {
        if(data&&data.count>0){
            $('#loadMoreSerchLink').show();
            $('#resultCountDIV').show();
            
            if(data.pageCount==searchPage){
                $('#loadMoreSerchLink').hide();
            }
            
            $('#resultCount').html(data.count);
        }else{
            searchPage=0;
            $('#loadMoreSerchLink').hide();
        }
        
        $('#searchMsg').html('');
        $('#rooms').append(new EJS({url : "/template/search.ejs"}).render(data));
        
    });
    
}    

function search(){
    searchPage = 0;
    
    $('#queryMinPrice').val($('#minPrice').val());
    $('#queryMaxPrice').val($('#maxPrice').val());  
    
    doSearch();
}



function searchByPrice(minPrice,maxPrice){
    searchPage = 0;
     
    $('#queryMinPrice').val(minPrice);
    $('#queryMaxPrice').val(maxPrice); 
      
    doSearch();
}


function loadMoreSerch(){
    doSearch();
}
  

function changeLan(lng){
    $.ajax({
      url: "/language?lng="+lng, 
    }).done(function(data) {
         location.reload();
    });
}



function signup(){
    $('#dataForm').submit(function(event) {        
        var msg_action=$('#msg_action');
        
        if($('#email').val()==''){
             msg_action.html("please input email"); 
        }else if($('#userName').val()==''){
             msg_action.html("please input name"); 
        }else if($('#password').val()!=$('#confirmPassword').val() ){
             msg_action.html("please confirm password"); 
        }else{
 
            $.ajax({
                type        : ('POST'),  
                url         : '/api/users/signup/', 
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

function foregetpassword(){
    $('#dataForm').submit(function(event) {        
        var msg_action=$('#msg_action');
        
        if($('#email').val()==''){
             msg_action.html("please input email"); 
        }else{
 
            $.ajax({
                type        : ('POST'),  
                url         : '/api/users/foregetpassword', 
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


function isEmailExist(){
    $('#email').change(function(){
        if($(this).val()!=''){
            var msg_email=$('#msg_email');
            $.getJSON( "/api/users/checkemail/"+$(this).val(), function( data ) {
                 
                 if(data){
                   if(data.code=='200'&&data.exist=='1'){
                        msg_email.removeClass('hide').show();
                   }else if((data.code=='200'&&data.exist=='0')||data.code=='404'){
                        msg_email.hide();
                   }
                }
                
            });
        }
        
    });
}