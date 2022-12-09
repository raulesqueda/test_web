const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click',function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})

fetch("results2.json")
.then(function(response){
   return response.json();
})
.then(function(results){
   let placeholder = document.querySelector("#data-output");
   let out = "";
   for(let results of results){
      out += `
         <tr>
            <td>${results.nombre_col}'> </td>
            <td>${results.num_code}</td>
            <td>${results.prom_valor_unitario_suelo}</td>
            <td>${results.valor_unitario_pred}</td>
            <td>${results.cambio_porcentual}</td>
         </tr>
      `;
   }
 
   placeholder.innerHTML = out;
});