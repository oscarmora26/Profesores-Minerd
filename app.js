const cedula = document.getElementById('cedula')
const imagenPerfil = document.getElementById('imagenPerfil')
const cedulaR = document.getElementById('cedulaR')
const nombre = document.getElementById('nombre')
const apellido = document.getElementById('apellido')
const correo = document.getElementById('correo')
const escuela = document.getElementById('escuela')
const imagenPrueba = document.getElementById('imagenPrueba')
const descripcion = document.getElementById('descripcion')
const cargarImgRegistro = document.getElementById('cargarImgRegistro')
const cargarImgEdit = document.getElementById('cargarImgEdit')

const cardInicio = document.getElementById('cardInicio')
const cardRegisto = document.getElementById('cardRegisto')
const cardImprimir = document.getElementById('card-imprimir')
const cardEdit = document.getElementById('card-edit')
const tableProfesores = document.getElementById('tableProfesores')
const tableBody = document.getElementById('tableBody')
const btnFloat = document.getElementById('btnFloat')
const detail = document.getElementById('detail')

const cedulaEditar = document.getElementById('cedulaEditar')
const nombreEditar = document.getElementById('nombreEditar')
const apellidoEditar = document.getElementById('apellidoEditar')
const correoEditar = document.getElementById('correoEditar')
const escuelaEditar = document.getElementById('escuelaEditar')
const imagenPruebaEditar = document.getElementById('imagenPruebaEditar')
const descripcionEditar = document.getElementById('descripcionEditar')
const indexOculto = document.getElementById('indexOculto')
const tProfe = document.getElementById('tProfe')
const tProfesoresVacio = document.getElementById('tProfesoresVacio')

const url = 'https://api.adamix.net/apec/cedula/'
let data;
btnFloatEstado = true
let imagenBase64
let maestros = []

const btnBuscar = document.getElementById('btnBuscar')
const btnRegistrar = document.getElementById('btnRegistrar')
const btnEditar = document.getElementById('btnEditar')
const btnCancelar = document.getElementById('btnCancelar')

btnBuscar.addEventListener('click',async (e) => {
    e.preventDefault()
    if(cedula.value == ''){
        alert('Debe de ingresar una cedula')
        return
    }
    await getData()
    console.log(data)

    if(!data.ok){
         alert('La persoona ingresada no existe')
    }else{

        let pro = getLocalStorage()
        if(pro != null){
            let b = false
            pro.forEach(element => {
                if(cedula.value == element.cedula){
                    let alerRes = alert('Esta profesor ya fue registrado')
                    b = true
                    return
                }
            });
            if(b){cedula.value = ''; return}
        } 
        cardInicio.classList.add('d-none')
        cardRegisto.classList.remove('d-none')
        cedulaR.value = data.Cedula
        nombre.value = data.Nombres
        apellido.value = data.Apellido1+' '+ data.Apellido2
        imagenPerfil.src = data.foto
    }   
})

async function getData() {
    try {
       let respuesta = await fetch(url + cedula.value)
       let json = await respuesta.json()
       data = json;    
        console.log(respuesta + 'Un problema')
       if(respuesta.ok == false) throw {error: respuesta}
    } catch (error) {
        console.log(error)
       alert(`Ha ocurrido un error ${error}`)
    }finally{

    }
}

btnRegistrar.addEventListener('click', (e) => {
    e.preventDefault()
    registro()
})

const registro = () => {

    console.log(getLocalStorage())

    console.log(validar())    
   if(validar()){ 
        maestros = []    
        if(getLocalStorage() == null)
            maestros = []
        else 
            maestros = getLocalStorage()
       
        maestros.push({
            cedula: data.Cedula,
            nombre: data.Nombres,
            apellido:data.Apellido1+' '+ data.Apellido2,
            fechaNacimiento: data.FechaNacimiento,
            fotoPerfil: data.foto,
            sexo:data.IdSexo,            
            correo: correo.value,
            descripcion: descripcion.value,
            fotoPrueba: imagenBase64,
            escuela: escuela.value,                   
        })     
    addLocalStorage(maestros)
    } 
}

const validar = () =>{
    let bool = true

    if(correo.value == ''){
        correo.classList.add('is-invalid')
        bool = false
    }else{ 
        correo.classList.remove('is-invalid')
        correo.classList.add('is-valid')
    }        
    
    if(escuela.value == ''){
        escuela.classList.add('is-invalid')
        bool = false
    }else{
        escuela.classList.remove('is-invalid')
        escuela.classList.add('is-valid')
    }   

    if(descripcion.value == ''){
        descripcion.classList.add('is-invalid')
        bool = false
    }else{
        descripcion.classList.remove('is-invalid')
        descripcion.classList.add('is-valid')
    }

    if(imagenPrueba.files.length == 0)
        bool = false
                
    return bool   
}

const addLocalStorage = (maestros) => {
    localStorage.setItem('maestros', JSON.stringify(maestros))
    btnFloat.click()
}

const getLocalStorage = () => {
    return JSON.parse(localStorage.getItem('maestros'))
}

const llenarTabla = () => {
    let profesores = getLocalStorage()

    if(profesores == null){
        tProfesoresVacio.classList.remove('d-none')
        tProfe.classList.add('d-none')
    }else{
        tProfesoresVacio.classList.add('d-none')
        tProfe.classList.remove('d-none')
        let contenido = ``
        let contador = 0
        if(profesores == null) return
        profesores.forEach(element => {
            contenido +=/*html*/ `
                <tr>
                    <th>${element.cedula}</th>
                    <td>${element.nombre}</td>
                    <td>${element.apellido}</td>
                    <td>${element.sexo}</td>
                    <td>${element.escuela}</td>
                    <th class="pb-0">
                    <button class="btn text-danger p-0" onclick="fillEdit(${contador})" data-toggle="tooltip" data-placement="bottom" title="Editar"><ion-icon name="create" size="large"></ion-icon></button>
                    <button class="btn text-success p-0" onclick="imprimir(${contador})" data-toggle="tooltip" data-placement="bottom" title="Imprimir"><ion-icon name="paper-plane" size="large"></ion-icon></button>
                </th>
                </tr>
            `       
            contador++
        });
        tableBody.innerHTML = contenido
    }
}

btnFloat.addEventListener('click', (e) => {
    e.preventDefault()
    if(btnFloatEstado){
        cardInicio.classList.add('d-none')
        cardRegisto.classList.add('d-none')
        tableProfesores.classList.remove('d-none')
        llenarTabla()
        btnFloat.innerHTML = `<ion-icon name="home-outline"></ion-icon>`
        btnFloatEstado = false
    }else{
       btnFloat.innerHTML = `<ion-icon name="document-text-outline"></ion-icon>`
       tableProfesores.classList.add('d-none')
       cardImprimir.classList.add('d-none')
       cardEdit.classList.add('d-none')
       cardInicio.classList.remove('d-none')      
       btnFloatEstado = true
    }    
})

imagenPrueba.addEventListener('change', () => {
    encodeImagen(imagenPrueba.files)
    setTimeout(() => {
        cargarImgRegistro.src = imagenBase64
    }, 0500)
})

function encodeImagen(imagenFiles) {
    fileSelect = imagenFiles
    let file;
    if(fileSelect.length > 0){
        file = fileSelect[0]
        let fileReader = new FileReader()

        fileReader.onload = function (FileLoadevent) {
            let srcData = FileLoadevent.target.result       
            imagenBase64 = srcData
        }
        fileReader.readAsDataURL(file)
    }
}

const imprimir = (index) =>{
    tableProfesores.classList.add('d-none')
    cardImprimir.classList.remove('d-none')

    let profesor = getLocalStorage()
    profesor = profesor[index]
    console.log(profesor)
    cardImprimir.innerHTML = ``
    let contenido = `
    <div class="row pt-4">
        <div class="col-12 col-md-5 ">
            <p><b>Cedula: </b><samp>${profesor.cedula}</samp></p>
            <p><b>Nombre: </b><samp>${profesor.nombre}</samp></p>
            <p><b>Apellido: </b><samp>${profesor.apellido}</samp></p>
            <p><b>Fecha nacimiento: </b><samp>${profesor.fechaNacimiento}</samp></p>
            <p><b>Sexo: </b><samp>${profesor.sexo}</samp></p>
            <p><b>Correo: </b><samp>${profesor.correo}</samp></p>
            <p><b>Escuela: </b><samp>${profesor.escuela}</samp></p>
            <p><b>Descripcion: </b><samp>${profesor.descripcion}</samp></p>
        </div>
        <div class="col-12 col-md-5">
            <img src="${profesor.fotoPerfil}" class="mr-3 d-block" alt="" style="width: 200px; height: 200px;"> 
            <img src="${profesor.fotoPrueba}" class="mt-3 d-block" alt="" style="width: 200px; height: 200px;">        
        </div>        
    </div>
 <div>
    <button class="btn btn-secondary mt-3 mb-4" onclick="print()">Imprimir</button>
 </div>
      `
    cardImprimir.innerHTML = contenido
}

const fillEdit = (index) => {

    tableProfesores.classList.add('d-none')
    cardEdit.classList.remove('d-none')
    console.log(index)
    let profesor = getLocalStorage()
    profesor = profesor[index]
    console.log(profesor)
    console.log(profesor.cedula)
 
    cedulaEditar.value = profesor.cedula     
    nombreEditar.value = profesor.nombre
    apellidoEditar.value = profesor.apellido
    correoEditar.value = profesor.correo
    escuelaEditar.value = profesor.escuela
    descripcionEditar.value = profesor.descripcion
    indexOculto.value = index
    cargarImgEdit.src = profesor.fotoPrueba
} 

btnEditar.addEventListener('click', e => {
    e.preventDefault()
    let profesores = getLocalStorage()
    let profesor = profesores[indexOculto.value]
    let index = indexOculto.value
    profesor.cedula = cedulaEditar.value   
    profesor.nombre = nombreEditar.value
    profesor.apellido = apellidoEditar.value
    profesor.correo = correoEditar.value
    profesor.escuela = escuelaEditar.value 
    profesor.descripcion = descripcionEditar.value

    if(imagenPruebaEditar.length == 0){
        profesor.fotoPrueba = profesor.fotoPrueba        
    }else{        
        profesor.fotoPrueba = imagenBase64
    }

    profesores.slice(index, 1, profesor)
    addLocalStorage(profesores)
    btnFloat.click()
})

imagenPruebaEditar.addEventListener('change', () => {
    encodeImagen(imagenPruebaEditar.files)
    setTimeout(() => {
        cargarImgEdit.src = imagenBase64
    }, 0500)
})
