const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click',function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})

$(document).ready(function(){
    $("#table_id").DataTable({
        ajax: {
            url:"2csvjson.json",
            dataSrc: ""
        },
        columns:[
            {"data":"col_name"},
            {"data":"mun_code"},
            {"data":"prom_valor_unitario_suelo"},
            {"data":"latitud"},
            {"data":"longitud"},
            {"data":"alcaldia"},
            {"data":"estado"}
        ]
    });
});