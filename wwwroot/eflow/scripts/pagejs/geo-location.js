var latitude = 0;
var longitude = 0;

$(document).ready(function () {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(

            function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                $('#GeoLocation').val(latitude + ',' + longitude);
            }
        );
    }
}