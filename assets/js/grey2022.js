//自动变灰
let myDate = new Date;
let mon = myDate.getMonth() + 1;
let date = myDate.getDate();
let days = ['11.30' , '12.1', '12.2', '12.3', '12.4', '12.5', '12.6'];
for (let day of days) {
    let d = day.split('.');
    if (mon == d[0] && date == d[1]) {
        document.write(
            '<style>html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none}</style>'
        );
        $("#change").html("Silence&nbsp;in&nbsp;silence");
        window.addEventListener('load', function () {
            setTimeout(function () {
                iziToast.show({
                });
            }, 3800);
        }, false);
    }
}