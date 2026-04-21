// Configuración global
const API_URL = '/api';
let currentUser = null;
let currentTenant = null;
let token = localStorage.getItem('token');
let navigationHistory = [];

// Elementos del DOM
const loginSection = document.getElementById('loginSection');
const tenantSection = document.getElementById('tenantSection');
const googleAuthSection = document.getElementById('googleAuthSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const tenantList = document.getElementById('tenantList');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        // Si hay token, intentar recuperar usuario y saltar login
        currentUser = JSON.parse(localStorage.getItem('user'));
        showTenants();
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// 1. Lógica de Autenticación
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            token = result.token;
            currentUser = result.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: `Hola, ${currentUser.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            showTenants();
        } else {
            Swal.fire('Error', result.error || 'Credenciales inválidas', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
});

async function showTenants() {
    loginSection.classList.add('hidden');
    tenantSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');

    try {
        const res = await fetch(`${API_URL}/empresas/mis-empresas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();

        if (res.ok) {
            const list = result.data || result;
            tenantList.innerHTML = list.map(empresa => `
                <button onclick="selectTenant(${empresa.id}, '${empresa.nombre}')" class="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left">
                    <div class="flex items-center gap-4">
                        <div class="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <i data-lucide="building-2"></i>
                        </div>
                        <div>
                            <p class="font-bold text-slate-900">${empresa.nombre}</p>
                            <p class="text-xs text-slate-500">RFC: ${empresa.rfc || 'N/A'}</p>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="text-slate-300 group-hover:text-blue-500"></i>
                </button>
            `).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        } else {
            if (res.status === 401) logout();
        }
    } catch (error) {
        console.error(error);
    }
}

function selectTenant(id, nombre) {
    currentTenant = { id, nombre };
    localStorage.setItem('tenantId', id);
    localStorage.setItem('tenantName', nombre);
    
    // En lugar de ir directo al dashboard, pedimos verificación de Google
    document.getElementById('verifyingTenantName').textContent = nombre;
    tenantSection.classList.add('hidden');
    googleAuthSection.classList.remove('hidden');
    
    // Inicializar botón de Google
    initGoogleAuth();
}

function initGoogleAuth() {
    // NOTA: Para producción necesitas un Client ID real de Google Cloud Console
    // Aquí usamos uno ficticio para la demostración de la UI
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: "900676586236-5hh8cu2at0eu2piltfofg9eb0es75jha.apps.googleusercontent.com",
            callback: handleGoogleSignIn
        });
        google.accounts.id.renderButton(
            document.getElementById("googleBtnContainer"),
            { theme: "outline", size: "large", text: "continue_with" }
        );
    } else {
        // Fallback si no carga el script de Google (simulación para desarrollo)
        const btn = document.getElementById("googleBtnContainer");
        btn.innerHTML = `
            <button onclick="handleGoogleSignIn({mock: true})" class="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium">
                <img src="https://www.google.com/favicon.ico" class="h-4 w-4">
                Verificar con Google (Demo)
            </button>
        `;
    }
}

function handleGoogleSignIn(response) {
    console.log("Google Auth Response:", response);
    
    Swal.fire({
        icon: 'success',
        title: 'Identidad Verificada',
        text: 'Acceso concedido a la empresa',
        timer: 1500,
        showConfirmButton: false
    });

    // Ahora sí, permitimos el ingreso al dashboard
    document.getElementById('activeTenantName').textContent = currentTenant.nombre;
    document.getElementById('userNameText').textContent = currentUser.nombre;
    document.getElementById('userRoleText').textContent = currentUser.rol || 'Usuario';

    // Mostrar opciones de administración si es admin
    const adminNav = document.getElementById('admin-only-nav');
    if (currentUser.rol === 'admin') {
        adminNav.classList.remove('hidden');
        document.getElementById('addNewBtn').classList.remove('hidden');
        document.querySelectorAll('.crud-admin-only').forEach(el => el.classList.remove('hidden'));
    } else {
        adminNav.classList.add('hidden');
        document.getElementById('addNewBtn').classList.add('hidden');
        document.querySelectorAll('.crud-admin-only').forEach(el => el.classList.add('hidden'));
    }

    // Asegurar que la navegación principal sea visible para todos
    document.getElementById('nav-crud').classList.remove('hidden');
    document.getElementById('nav-queries').classList.remove('hidden');
    document.getElementById('nav-home').classList.remove('hidden');

    googleAuthSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    
    // Asegurar que el sidebar sea visible
    const sidebar = document.getElementById('mainSidebar');
    if (sidebar) sidebar.classList.remove('hidden');
    
    showView('home');
    loadDashboardKPIs();
}

// 2. Lógica del Dashboard
async function loadDashboardKPIs() {
    try {
        const res = await fetch(`${API_URL}/dashboard/resumen`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'x-empresa': currentTenant.id
            }
        });
        const result = await res.json();
        
        if (res.ok) {
            const data = result.data;
            document.getElementById('kpi-clientes').textContent = data.total_clientes;
            document.getElementById('kpi-productos').textContent = data.total_productos;
            document.getElementById('kpi-operaciones').textContent = data.total_operaciones;
            
            renderMainCharts();
        }
    } catch (error) {
        console.error(error);
    }
}

let mainChart, pieChart;
function renderMainCharts() {
    const ctxMain = document.getElementById('mainChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');

    if (mainChart) mainChart.destroy();
    if (pieChart) pieChart.destroy();

    mainChart = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Operaciones',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Norte', 'Sur', 'Centro'],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6'],
                hoverOffset: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// 3. Navegación
function showView(view, pushHistory = true) {
    const views = ['home', 'queries', 'crud', 'users'];
    
    // Guardar en historial si no es una navegación de "atrás"
    if (pushHistory) {
        const lastView = navigationHistory[navigationHistory.length - 1];
        if (lastView !== view) {
            navigationHistory.push(view);
        }
    }

    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
        
        const navEl = document.getElementById(`nav-${v}`);
        if (navEl) navEl.classList.remove('sidebar-active');
    });

    const targetView = document.getElementById(`view-${view}`);
    if (targetView) targetView.classList.remove('hidden');
    
    const targetNav = document.getElementById(`nav-${view}`);
    if (targetNav) targetNav.classList.add('sidebar-active');
    
    const titles = { 
        'home': 'Dashboard', 
        'queries': 'Reportes Dinámicos', 
        'crud': 'Gestión de Datos',
        'users': 'Usuarios Empresa'
    };
    document.getElementById('currentViewTitle').textContent = titles[view] || 'Dashboard';

    if (view === 'crud') loadCrud('clientes');
    if (view === 'queries') loadQueryOptions();
    if (view === 'users') loadUsers();
}

// 4. Lógica de Usuarios (Admin Only)
async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/admin/users`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'x-empresa': currentTenant.id
            }
        });
        const result = await res.json();
        
        if (res.ok) {
            const users = result.data;
            const tbody = document.querySelector('#usersTable tbody');
            tbody.innerHTML = users.map(u => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-900">${u.nombre_corto}</td>
                    <td class="px-6 py-4 text-slate-600">${u.nombre_largo}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">
                            ${u.rol.toUpperCase()}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="deleteUser(${u.id})" class="text-red-500 hover:text-red-700 p-1"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                    </td>
                </tr>
            `).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    } catch (error) {
        console.error(error);
    }
}

async function openCreateUserModal() {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar Nuevo Usuario',
        html:
            '<input id="swal-nombre_corto" class="swal2-input" placeholder="Usuario (ej. juan_perez)">' +
            '<input id="swal-nombre_largo" class="swal2-input" placeholder="Nombre Completo">' +
            '<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">' +
            '<select id="swal-rol" class="swal2-input">' +
            '<option value="user">Usuario Estándar</option>' +
            '<option value="admin">Administrador</option>' +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear Usuario',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                nombre_corto: document.getElementById('swal-nombre_corto').value,
                nombre_largo: document.getElementById('swal-nombre_largo').value,
                contraseña: document.getElementById('swal-password').value,
                rol: document.getElementById('swal-rol').value
            }
        }
    });

    if (formValues) {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-empresa': currentTenant.id
                },
                body: JSON.stringify(formValues)
            });
            const result = await res.json();
            
            if (res.ok) {
                Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
                loadUsers();
            } else {
                Swal.fire('Error', result.error || 'No se pudo crear el usuario', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    }
}

async function deleteUser(userId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el acceso del usuario a esta empresa.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-empresa': currentTenant.id
                }
            });
            
            if (res.ok) {
                Swal.fire('Eliminado', 'El usuario ha sido desvinculado.', 'success');
                loadUsers();
            } else {
                const err = await res.json();
                Swal.fire('Error', err.error || 'No se pudo eliminar', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    }
}

// 5. Lógica de Consultas Dinámicas
async function loadQueryOptions() {
    if (!currentTenant) return;
    try {
        const res = await fetch(`${API_URL}/queries`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'x-empresa': currentTenant.id
            }
        });
        const result = await res.json();
        const select = document.getElementById('querySelect');
        
        if (res.ok) {
            const queries = result.data;
            select.innerHTML = '<option value="">Selecciona una consulta...</option>' + 
                queries.map(q => `<option value="${q.id}">${q.nombre}</option>`).join('');
        }
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('runQueryBtn').addEventListener('click', async () => {
    const queryId = document.getElementById('querySelect').value;
    if (!queryId) return Swal.fire('Atención', 'Selecciona una consulta', 'warning');

    const resultsDiv = document.getElementById('queryResults');
    resultsDiv.innerHTML = '<div class="p-20 flex justify-center"><div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div></div>';

    try {
        const res = await fetch(`${API_URL}/queries/ejecutar/${queryId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-empresa': currentTenant.id
            },
            body: JSON.stringify({ chart: true, chartType: 'bar' })
        });
        const result = await res.json();
        
        if (res.ok) {
            renderQueryResults(result);
            if (result.chartData) {
                updateDashboardCharts(result.chartData);
            }
        } else {
            Swal.fire('Error', result.error, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo ejecutar la consulta', 'error');
    }
});

function updateDashboardCharts(chartData) {
    if (!mainChart) return;
    
    mainChart.data.labels = chartData.labels;
    mainChart.data.datasets[0].data = chartData.datasets[0].data;
    mainChart.data.datasets[0].label = chartData.datasets[0].label;
    mainChart.update();

    // Si hay más de un dataset o datos para pie chart, podrías actualizar el segundo aquí
    if (pieChart && chartData.labels.length <= 5) {
        pieChart.data.labels = chartData.labels;
        pieChart.data.datasets[0].data = chartData.datasets[0].data;
        pieChart.update();
    }
}

function renderQueryResults(result) {
    const data = result.data || result;
    const resultsDiv = document.getElementById('queryResults');
    const resultados = data.resultados || [];
    const cols = resultados.length > 0 ? Object.keys(resultados[0]) : [];
    
    resultsDiv.innerHTML = `
        <div class="p-6">
            <h4 class="font-bold text-slate-900 mb-4">${data.config.nombre}</h4>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                    <thead class="bg-slate-50 text-slate-500 uppercase">
                        <tr>
                            ${cols.map(c => `<th class="px-4 py-3 border-b border-slate-100">${c}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${resultados.map(row => `
                            <tr>
                                ${cols.map(c => `<td class="px-4 py-3 text-slate-600">${row[c]}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

document.getElementById('exportQueryBtn').addEventListener('click', async () => {
    const queryId = document.getElementById('querySelect').value;
    if (!queryId) return Swal.fire('Atención', 'Selecciona una consulta', 'warning');

    try {
        const res = await fetch(`${API_URL}/queries/exportar/${queryId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-empresa': currentTenant.id
            }
        });
        
        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_${queryId}.xlsx`;
            a.click();
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo exportar', 'error');
    }
});

// 5. Lógica CRUD
let currentCrudTable = 'clientes';

async function loadCrud(table) {
    currentCrudTable = table;
    const btnClientes = document.getElementById('btn-crud-clientes');
    const btnProductos = document.getElementById('btn-crud-productos');
    
    if (table === 'clientes') {
        btnClientes.classList.add('bg-blue-600', 'text-white');
        btnClientes.classList.remove('text-slate-500');
        btnProductos.classList.add('text-slate-500');
        btnProductos.classList.remove('bg-blue-600', 'text-white');
    } else {
        btnProductos.classList.add('bg-blue-600', 'text-white');
        btnProductos.classList.remove('text-slate-500');
        btnClientes.classList.add('text-slate-500');
        btnClientes.classList.remove('bg-blue-600', 'text-white');
    }

    try {
        const res = await fetch(`${API_URL}/crud/${table}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'x-empresa': currentTenant.id
            }
        });
        const result = await res.json();
        const list = result.data || [];
        
        const tbody = document.querySelector('#crudTable tbody');
        tbody.innerHTML = list.map(row => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900">#${row.id}</td>
                <td class="px-6 py-4 text-slate-600">${row.codigo}</td>
                <td class="px-6 py-4 text-slate-600">${row.nombre}</td>
                <td class="px-6 py-4 text-right space-x-2 crud-admin-only ${currentUser.rol === 'admin' ? '' : 'hidden'}">
                    <button onclick="editRecord('${table}', ${row.id}, '${row.codigo}', '${row.nombre}')" aria-label="Editar" class="text-blue-600 hover:text-blue-800"><i data-lucide="edit-2" class="h-4 w-4"></i></button>
                    <button onclick="deleteRecord('${table}', ${row.id})" aria-label="Eliminar" class="text-red-500 hover:text-red-700"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                </td>
            </tr>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('addNewBtn').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
        title: `Nuevo ${currentCrudTable === 'clientes' ? 'Cliente' : 'Producto'}`,
        html:
            `<input id="swal-codigo" class="swal2-input" placeholder="Código">` +
            `<input id="swal-nombre" class="swal2-input" placeholder="Nombre">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return {
                codigo: document.getElementById('swal-codigo').value,
                nombre: document.getElementById('swal-nombre').value
            }
        }
    });

    if (formValues) {
        try {
            const res = await fetch(`${API_URL}/crud/${currentCrudTable}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-empresa': currentTenant.id
                },
                body: JSON.stringify(formValues)
            });
            if (res.ok) {
                Swal.fire('Guardado', 'Registro creado correctamente', 'success');
                loadCrud(currentCrudTable);
            } else {
                const err = await res.json();
                Swal.fire('Error', err.error || 'No se pudo guardar', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    }
});

async function editRecord(table, id, codigo, nombre) {
    const { value: formValues } = await Swal.fire({
        title: `Editar ${table === 'clientes' ? 'Cliente' : 'Producto'}`,
        html:
            `<input id="swal-codigo" class="swal2-input" value="${codigo}" placeholder="Código">` +
            `<input id="swal-nombre" class="swal2-input" value="${nombre}" placeholder="Nombre">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return {
                codigo: document.getElementById('swal-codigo').value,
                nombre: document.getElementById('swal-nombre').value
            }
        }
    });

    if (formValues) {
        try {
            const res = await fetch(`${API_URL}/crud/${table}/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-empresa': currentTenant.id
                },
                body: JSON.stringify(formValues)
            });
            if (res.ok) {
                Swal.fire('Actualizado', 'Registro actualizado correctamente', 'success');
                loadCrud(table);
            } else {
                const err = await res.json();
                Swal.fire('Error', err.error || 'No se pudo actualizar', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    }
}

async function deleteRecord(table, id) {
    const result = await Swal.fire({
        title: '¿Eliminar registro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`${API_URL}/crud/${table}/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'x-empresa': currentTenant.id
                }
            });
            if (res.ok) {
                Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
                loadCrud(table);
            } else {
                const err = await res.json();
                Swal.fire('Error', err.error || 'No se pudo eliminar', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    }
}

// 5. Utilidades
function logout() {
    localStorage.clear();
    location.reload();
}

function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Quitar la vista actual
        const previousView = navigationHistory[navigationHistory.length - 1];
        showView(previousView, false); // Navegar a la anterior sin guardar de nuevo
    } else {
        switchTenant();
    }
}

function switchTenant() {
    dashboardSection.classList.add('hidden');
    googleAuthSection.classList.add('hidden');
    tenantSection.classList.remove('hidden');
    navigationHistory = []; // Limpiar historial al cambiar de empresa
}
