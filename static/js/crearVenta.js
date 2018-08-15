$(document).ready(function(){
        $('#id_Total').text("0.00");
        $('#bt_add').click(function(){
            agregar();
        });
        $('#bt_del').click(function(){
            eliminar(id_fila_selected);
        });
        $('#bt_delall').click(function(){
            eliminarTodasFilas();
        });

        $('#bt_GenerarVenta').click(function(){
            GenerarVenta();
        });
        $("#precioUnitario").change(function(){
                //alert($(this).val());
                //alert("hola");
                //$('#valor2').val($(this).val());
        });
        
    });
    function CalcularSubTotal(id,cantidad){
        SubTotal = $('#precioUnitario'+id).val()*cantidad;
        SubTotal = parseFloat(SubTotal).toFixed(2);
        $('#SubTotal'+id).text(SubTotal);
        RefrescarTotal();
           

        //console.log($(this));
    }
    function reset_values(){
        $('#inpt-producto').val('');
        $('#codigo').val('');
        $('#precio').val('');
        $('#cantidad').val('');
    }

    var TotalVenta=0;
    var cont=0;
    var id_fila_selected=[];
    function agregar(){
        cont++;
        Producto = $('#inpt-producto').val();
        codigo = $('#codigo').val();
        precio = $('#precio').val();
        cantidad = $('#cantidad').val();
        error = "";
        if (Producto==''){
            error = 1;
        }
        
        if (cantidad==''){
            error = 2;
        }
        if (error=="") {
            SubTotal = parseFloat(precio*cantidad).toFixed(2);
            var fila='<tr class="selected" id="fila'+cont+'" onclick="seleccionar(this.id);"><td>'+cont+'</td><td><input type="number" name="cantidad'+cont+'" id="cantidad"'+cont+'" required="" class="form-control" value="'+cantidad+'"></td><td>'+codigo+'</td><td>'+Producto+'</td><td><input type="number" name="precioUnitario'+cont+'" id="precioUnitario'+cont+'" required="" class="form-control" value="'+precio+'" onchange="CalcularSubTotal('+cont+','+cantidad+')" ></td></td><td><label id="SubTotal'+cont+'" name="SubTotal'+cont+'">'+SubTotal+'</label></td></tr>';
            $('#tabla').append(fila);

            TotalVenta =  parseFloat(Math.round((TotalVenta + (precio*cantidad)) * 100) / 100).toFixed(2);

            //$('#id_Total').text("S/. "+TotalVenta);
            RefrescarTotal();
            reset_values();
            reordenar();
        }
        else{
            switch(error) {
            case 1:
                alert("Seleccione un producto válido!");
                $( "#inpt-producto" ).focus();
                break;
            case 2:
                alert("Ingrese una cantidad");
                $( "#cantidad" ).focus();
                break;
            
            }
        }
    }

    function seleccionar(id_fila){
        if($('#'+id_fila).hasClass('seleccionada')){
            $('#'+id_fila).removeClass('seleccionada');
        }
        else{
            $('#'+id_fila).addClass('seleccionada');
        }
        //2702id_fila_selected=id_fila;
        id_fila_selected.push(id_fila);
    }

    function eliminar(id_fila){
        /*$('#'+id_fila).remove();
        reordenar();*/
        ValorRestar = 0;
        for(var i=0; i<id_fila.length; i++){
            $('#'+id_fila[i]).children("td").each(function (index2) {
                switch (index2) {
                    case 5:
                        ValorRestar = parseFloat($(this).text()).toFixed(2);
                        break;
                }
            });
            //TotalVenta = TotalVenta - ValorRestar
            //$('#id_Total').text("S/. "+TotalVenta);
            RefrescarTotal();
            $('#'+id_fila[i]).remove();
        }
        reordenar();
    }

    function reordenar(){
        var num=1;
        $('#tabla tbody tr').each(function(){
            $(this).find('td').eq(0).text(num);
            num++;
        });
    }

    function RefrescarTotal(){
        Total=0;
        $('#tabla tbody tr').each(function(){
            valor = $(this).find('td').eq(5).children('label').text();
            //console.log(valor);
            Total = Total + parseFloat(valor);
            $('#id_Total').text(Total);
            //alert(Total);
        });
    }

    function eliminarTodasFilas(){
    $('#id_Total').text("0.00");
    $('#tabla tbody tr').each(function(){
            $(this).remove();
        });

    }

    function GenerarVenta(){
        var num=1;
        productos = [];
        contador = 0;
        $("#tabla tbody tr").each(function (index) {
            $(this).children("td").each(function (index2) {
                producto = [];
                switch (index2) {
                    case 1:
                        cantidad = $(this).text();
                        break;
                    case 2:
                        codigo = $(this).text();
                        break;
                    case 5:
                        precioVenta = $(this).text();
                        break;
                }
            });
            contador = 1;
            productos.push([cantidad,codigo,precioVenta]);
        });
        //console.log(productos);
        if (contador == 1) {
            var datos = {productos: productos};
            var sendData = JSON.stringify(datos); 
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/venta/insertar/",                  
                data: sendData,                    
                contentType: "application/json; charset=utf-8",
                async: false,
                cache: false,                    
                CrossDomain: true,

                success: function (result) {
                    var id_venta = result["id_venta"];
                    alert('Venta Registrada');
                    location.reload(true);
                    imprimir_venta(id_venta);
                }
            });
        }else{
            alert("No registró ningún producto");
        }
    }
function imprimir_venta(id_venta){
        window.open('/venta/imprimir/'+id_venta+'/', '_blank');
    }