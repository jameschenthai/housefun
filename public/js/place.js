
function initBTS(locationId){    
    $.getJSON("/api/locations/1", null, function(data, status){
	     
        if ( data.status == 'success' ) {
            var objSelect = $('#locationId');
            $.each(data.records, function(k, record){
                objSelect.append($("<option></option>").attr("value", record.id).text(record.name));
            }); 

            if(locationId&&locationId!=''){
                objSelect.val(locationId);
            }

        }  
	}); 
}  
 

function initProvinces2(provinceId,cityId){    
    $.getJSON("/api/provinces/TH", null, function(data, status){
	     
        if ( data.status == 'success' ) {
            var provinceSelect = $('#provinceId');
            $.each(data.records, function(k, record){
                provinceSelect.append($("<option></option>").attr("value", record.provinceId).text(record.name));
            }); 

            
            if(provinceId&&provinceId!=''){
                provinceSelect.val(provinceId);
                initCitys(cityId);
            }
             
            
            //province-menu
            var provinceMenu = $('#menu_province');
            $.each(data.records, function(k, record){
                provinceMenu.append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:clickProvince(\''+record.provinceId+'\',\''+record.name+'\')">'+record.name+'</a></li>');
            }); 
             
            
        } 

        provinceSelect.change(function(){
            initCitys(cityId);
        }); 

	}); 
}    


function initProvinces(provinceId,cityId){    
    $.getJSON("/api/provinces/TH", null, function(data, status){
	     
        if ( data.status == 'success' ) {
            var provinceMenu = $('#menu_province');
            $.each(data.records, function(k, record){
                provinceMenu.append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:chooseProvince(\''+record.provinceId+'\',\''+record.name+'\')">'+record.name+'</a></li>');
            }); 
        } 


	}); 
}    



function initCitys(cityId){    
    $.getJSON("/api/globalProvinces/"+$('#provinceId').val(), null, function(data, status){
			if ( data.status == 'success' ) {
                var citySelect = $('#cityId');
                citySelect.html('');
				$.each(data.records, function(k, record){
                    citySelect.append($("<option></option>").attr("value", record.cityId).text(record.name));
				});
			
              if(cityId&&cityId!=''){
                    citySelect.val(cityId);
              }
			}
			
		}); 
}    


function displayCitys(provinceId){  
    $.getJSON("/api/globalProvinces/"+provinceId, null, function(data, status){
			if ( data.status == 'success' ) {
                var cityMenu = $('#menu_city');
                cityMenu.html('');
				$.each(data.records, function(k, record){
                     cityMenu.append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:chooseCity(\''+record.cityId+'\',\''+record.name+'\')">'+record.name+'</a></li>');
				});
                 
                $('#dropdown_city').addClass("open");
			}
			
		}); 
}    



function chooseProvince(provinceId,provinceName){
    $('#provinceId').val(provinceId);
    $('#dropdownMenu_province').text(provinceName);
    displayCitys(provinceId);
}


function chooseCity(cityId,cityName){
    $('#cityId').val(cityId);
    $('#dropdownMenu_city').text(cityName);
}


function chooseHouseType(houseTypeId,houseTypeName){
    $('#houseType').val(houseTypeId);
    $('#dropdownMenu_houseType').text(houseTypeName);
}

