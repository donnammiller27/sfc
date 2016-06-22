//global to hold JSON data
var JSON_FARES="";

//populate sfzone with names and zone values
var typeHtml = function() {
 var sftypeHtml = '';
 var types = ['weekday', 'evening_weekend', 'anytime'];
 for (var i=0; i < types.length; i++) {
   sftypeHtml += '<option value = "' + types[i] + '">'+ types[i] + '</option>';
  }  
  return sftypeHtml;  
}

//calculate fare based on zone, type, purchase, and qty
var calcFare = function(zone, type, purchased, qty) {
  var septaFare = 0;
  var numRides = qty;
  var extraRides = 0;
  
  if (zone < 1 || zone > 5) {
    alert("Invalid zone");
    return 0;
  }
    
  var value = JSON_FARES.zones[zone-1];
  
  for (var i=0; i < value.fares.length;i++){	       
    if (type === value.fares[i].type &&
        purchased === value.fares[i].purchase) {
          septaFare = value.fares[i].price;
          // use price for every number of trips
          // if exceeds number of trips for price, then increase
          // numRides by 1
          numRides = parseInt(qty / value.fares[i].trips);
          extraRides = qty % value.fares[i].trips;
          if (extraRides > 0) {            	    
            numRides++;
          } 
          return (septaFare*numRides);
     }
  }   
};

//populate sfzone with name and zone values 
var zoneHtml = function() {
 var sfzoneHtml = '';          
 
 $.each(JSON_FARES.zones, function(index, val) {
       sfzoneHtml += '<option value = "' + val.zone + '">'+ val.name + '</option>';
 });  
  return sfzoneHtml;  
}




//plugin septa fare calculator
$.fn.septaFareCalculator = function() {
//populate HTML	
  $(this).load('septafc.html');  
 
  // get JSON via AJAX and store data in global variable JSON_FARES
  // populate select options for zones and types from JSON	
  $.ajax({
            url: 'fares.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {	
              JSON_FARES = data;
              //populate sfzone with JSON names and zone values  
              $('#sfzone').html(zoneHtml());          
              $('#sftype').html(typeHtml);
	      $('#advance_purchase').prop('checked', true);

              // on change, display matching help text for selected type value
              $('#sftype').change(function () {     		  
                $('#type-helptext').html(JSON_FARES.info[$(this).val()]);
                // anytime can only be an advance_purchase, so disable onboard 
                // and check advance_purchase
                if ($('#sftype').val() == "anytime") {
                  $('#onboard_purchase').prop('disabled', true);
                  $('#advance_purchase').prop('checked', true);
                } else {
                  $('#onboard_purchase').prop('disabled', false);
                } 
               });  

               $('#sfform').change(function() {
              // recalc computed fare based on inputs
                var fzone = $('#sfzone').val();
                var ftype = $('#sftype').val();    
                var fpurchase = $('input[name=sfpurchase]:checked').val();
                var fqty = $('#fareqty').val();    
    
                $('#totalfare').html('$' + calcFare(fzone, ftype, fpurchase, fqty).toFixed(2)); 

              });  

           }  
             
  });

   return this;
}		






         

