// Credenciales Cifradas
const _0xa4 = ["YWRtaW5AbWcuY29t", "bWcxMjM="]; 
let productos = JSON.parse(localStorage.getItem('mg_v_protected_db')) || [];

// Iniciar App
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
});

// Sistema de Login
function intentarLogin() {
    const u = document.getElementById('email').value.trim();
    const p = document.getElementById('pass').value.trim();
    const m = document.getElementById('login-msg');

    if (u === atob(_0xa4[0]) && p === atob(_0xa4[1])) {
        document.getElementById('btn-admin-nav').classList.remove('d-none');
        document.getElementById('nav-logout-item').classList.remove('d-none');
        document.getElementById('nav-login-item').classList.add('d-none');
        m.innerText = "";
        showSection('admin', document.querySelector('#btn-admin-nav a'));
        alert("¡Acceso concedido!");
    } else {
        m.innerText = "❌ Datos incorrectos.";
    }
}

function logout() {
    if(confirm('¿Deseas cerrar la sesión administrativa?')) location.reload();
}

// Navegación
function showSection(id, el) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if(el) el.classList.add('active');
    
    const navCol = document.getElementById('navbarNav');
    if (navCol && navCol.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCol) || new bootstrap.Collapse(navCol);
        bsCollapse.hide();
    }
}

function irACatalogo() {
    showSection('catalogo', document.getElementById('link-catalogo'));
    window.scrollTo(0, 0);
}

// Renderizado
function renderAll() {
    renderGrid(productos, 'grid-catalogo');
    renderGrid(productos.filter(p => p.oferta), 'grid-ofertas');
    
    const t = document.getElementById('tabla-admin'); 
    if(t) {
        t.innerHTML = '';
        productos.forEach(p => {
            t.innerHTML += `
                <tr>
                    <td><img src="${p.img}" width="40" height="40" style="object-fit:cover;border-radius:4px"></td>
                    <td class="small fw-bold">${p.nombre}</td>
                    <td class="small">${p.categoria}</td>
                    <td>
                        <button class="btn btn-sm btn-dark" onclick="editar(${p.id})">✎</button> 
                        <button class="btn btn-sm btn-danger" onclick="borrar(${p.id})">X</button>
                    </td>
                </tr>`;
        });
    }
}

function renderGrid(lista, contId) {
    const cont = document.getElementById(contId); 
    if(!cont) return;
    cont.innerHTML = lista.length ? '' : '<p class="text-center w-100 py-4 small text-muted">Próximamente más productos...</p>';
    
    lista.forEach(p => {
        cont.innerHTML += `
            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    ${p.oferta ? '<span class="badge" style="background:var(--mg-rose); position:absolute; top:10px; right:10px;">OFERTA</span>' : ''}
                    <img src="${p.img}" class="card-img-top" style="height:250px; object-fit:cover;">
                    <div class="card-body text-center">
                        <h6 class="mb-1 fw-bold">${p.nombre}</h6>
                        <p class="small text-muted mb-1">${p.categoria}</p>
                        <p class="fw-bold mb-2" style="color:var(--mg-rose)">$${p.precio}</p>
                        <a href="https://wa.me/56938926682?text=Consulta:%20${p.nombre}" target="_blank" class="btn btn-dark btn-sm rounded-pill px-4">Consultar</a>
                    </div>
                </div>
            </div>`;
    });
}

function filtrarCategoria(cat) {
    if (cat === 'todos') renderGrid(productos, 'grid-catalogo');
    else renderGrid(productos.filter(p => p.categoria === cat), 'grid-catalogo');
}

// Gestión de Producto (CRUD)
function previewFile() {
    const file = document.getElementById('pFile').files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        document.getElementById('pImgBase64').value = reader.result;
        const preview = document.getElementById('preview-img');
        preview.src = reader.result; 
        preview.style.display = 'block';
    };
    if (file) reader.readAsDataURL(file);
}

function guardar() {
    const id = document.getElementById('pId').value;
    const img = document.getElementById('pImgBase64').value;
    const nom = document.getElementById('pNom').value;
    const pre = document.getElementById('pPre').value;
    const cat = document.getElementById('pCat').value;
    
    if(!img || !nom || !pre) return alert("Faltan datos (Nombre, Precio o Imagen).");
    
    const p = { 
        id: id ? parseInt(id) : Date.now(), 
        nombre: nom, 
        precio: pre, 
        img: img, 
        categoria: cat, 
        oferta: document.getElementById('pOf').checked 
    };

    if(id) { 
        const i = productos.findIndex(x => x.id == id); 
        if(i !== -1) productos[i] = p; 
    } else { 
        productos.push(p); 
    }

    localStorage.setItem('mg_v_protected_db', JSON.stringify(productos));
    
    const modalInst = bootstrap.Modal.getInstance(document.getElementById('modalProd'));
    if(modalInst) modalInst.hide();
    
    renderAll();
}

function borrar(id) { 
    if(confirm('¿Seguro que quieres eliminar este producto?')) { 
        productos = productos.filter(x => x.id != id); 
        localStorage.setItem('mg_v_protected_db', JSON.stringify(productos)); 
        renderAll(); 
    } 
}

function editar(id) {
    const p = productos.find(x => x.id == id);
    if(!p) return;
    document.getElementById('pId').value = p.id; 
    document.getElementById('pNom').value = p.nombre; 
    document.getElementById('pPre').value = p.precio;
    document.getElementById('pCat').value = p.categoria;
    document.getElementById('pImgBase64').value = p.img; 
    const preview = document.getElementById('preview-img');
    preview.src = p.img; 
    preview.style.display = 'block';
    document.getElementById('pOf').checked = p.oferta; 
    new bootstrap.Modal(document.getElementById('modalProd')).show();
}

function limpiarForm() { 
    document.getElementById('formP').reset(); 
    document.getElementById('pId').value = ''; 
    document.getElementById('preview-img').style.display = 'none'; 
    document.getElementById('pImgBase64').value = ''; 
}

document.addEventListener('contextmenu', e => e.preventDefault());