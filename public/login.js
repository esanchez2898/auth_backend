const loginSection = document.querySelector('.login');
const registerSection = document.querySelector('.register');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');


toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-right',
    timeOut: '5000'
};




// Show the register section: Event listener for the "Register" link
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.hidden = true;
    registerSection.hidden = false;
});

// Show the login section: Event listener for the "Login" link
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.hidden = true;
    loginSection.hidden = false;
});

// Basic form validation: Ensures that both email and password fields are filled
function validateForm(email, password) {
    if (!email || !password) {
        toastr.error('All fields are required');
        return false;  // Prevent form submission
    }
    return true;  // Proceed if both fields are filled
}




// ---------   Register   ---------

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = document.getElementById('name').value;
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('pw').value;

    // Mostrar mensaje de "Cargando..."
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we log you in',
        allowOutsideClick: false,  // No permite cerrar la alerta haciendo clic fuera
        didOpen: () => {
            Swal.showLoading();  // Muestra el spinner de carga
        }
    });


    if (!validateForm(userEmail, userPassword)) return;  // Validate the form. If validation fails, stop here.

    // Send a POST request to the server to register the new user
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  // Send the data as JSON
        body: JSON.stringify({ user: userName, email: userEmail, pwd: userPassword })  // Send the user's details
    })
        .then(response => response.json())  // Convert the server response to JSON
        .then(data => {  // Handle the response
            if (data.success) {
                Swal.close();
                Swal.fire('Success', data.success, 'success').then(() => {
                    window.location.href = 'index.html';  // If registration is successful, redirect to login
                });
            } else {
                Swal.close();
                toastr.error(data.error);
            }
        })
        .catch(error => {  // Handle any errors that occur during the request
            Swal.close();
            toastr.error('Something went wrong with the connection');
            console.error('Error:', error);
        });
});




// ---------   Login   ---------

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userEmail = document.getElementById('email-lg').value;
    const userPassword = document.getElementById('pw-lg').value;

    // Mostrar mensaje de "Cargando..."
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we log you in',
        allowOutsideClick: false,  // No permite cerrar la alerta haciendo clic fuera
        didOpen: () => {
            Swal.showLoading();  // Muestra el spinner de carga
        }
    });

    if (!validateForm(userEmail, userPassword)) return;  // Validate the form. If validation fails, stop here.

    // Send a POST request to the server to log in the user
    // Este bloque maneja el inicio de sesión del usuario
    fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Incluir credenciales
        body: JSON.stringify({ email: userEmail, pwd: userPassword })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.close();
                toastr.error(data.error);
            } else {
                Swal.close();
                Swal.fire('Success', 'Login successful', 'success').then(() => {
                    // Guardar el accessToken en el almacenamiento local
                    localStorage.setItem('accessToken', data.accessToken);

                    // Realizar la solicitud GET a /todo con el accessToken
                    fetch('/todo', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.accessToken}`  // Incluir el accessToken en el encabezado
                        },
                        credentials: 'include'
                    })
                        .then(response => {
                            if (response.status === 401) {
                                // Redirigir a la página de inicio de sesión si el token no es válido
                                window.location.href = '/'; // Cambia esto a la ruta de inicio de sesión
                            } else if (!response.ok) {
                                throw new Error('Error en la solicitud');
                            }
                            return response.json();
                        })
                        .then(todoData => {
                            // Manejar los datos de las tareas y mostrarlas en la interfaz
                            console.log(todoData); // Imprimir los datos en la consola

                            // Por ejemplo, si tienes una lista en tu HTML para mostrar las tareas
                            const todoList = document.getElementById('todoList');
                            todoData.forEach(todo => {
                                const li = document.createElement('li');
                                li.textContent = todo.title; // Asegúrate de que 'title' sea una propiedad válida
                                todoList.appendChild(li);
                            });
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.close();
                            toastr.error('Algo salió mal al obtener la lista de tareas');
                        });
                });
            }
        })
        .catch(error => {
            Swal.close();
            toastr.error('Something went wrong with the connection');
            console.error('Error:', error);
        });


});
