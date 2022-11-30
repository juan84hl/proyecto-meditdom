function iniciarMapiniciarMap(){
    var coord = {lat:1893439 ,lng: 7041596 };
    var map = new google.maps.Map(document.getElementById('map'),{
      zoom: 10,
      center: coord
    });
    var marker = new google.maps.Marker({
      position: coord,
      map: map
    });
}