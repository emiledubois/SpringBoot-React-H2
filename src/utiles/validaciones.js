const EMAIL_PATTERN = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
const PHONE_PATTERN = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const PASSWORD_PATTERN = /.{8,}/;

/**
 * Función que valida los datos del formulario de contacto.
 * @param {object} formData - El objeto que contiene los valores de los inputs.
 * @returns {object} Un objeto con los errores encontrados.
 */
export const validateForm = (formData) => {
    let errors = {};
    let isValid = true;
    const { name, email, phone, subject, message } = formData;

    // --- Validar Nombre (Required, max 100) ---
    if (name.trim() === '') {
        errors.name = 'Por favor ingresa tu nombre';
        isValid = false;
    } else if (name.trim().length > 100) {
        errors.name = 'El nombre no puede superar los 100 caracteres';
        isValid = false;
    }

    // --- Validar Email (Required, pattern) ---
    if (!EMAIL_PATTERN.test(email)) {
        errors.email = 'Por favor ingresa un email válido (solo dominios duoc.cl, profesor.duoc.cl o gmail.com)';
        isValid = false;
    }

    // --- Validar Teléfono (Optional, pattern) ---
    if (phone && !PHONE_PATTERN.test(phone)) {
        errors.phone = 'Por favor ingresa un teléfono válido';
        isValid = false;
    }

    // --- Validar Asunto (Required) ---
    if (subject.trim() === '') {
        errors.subject = 'Por favor ingresa el asunto';
        isValid = false;
    }

    // --- Validar Mensaje (Required, max 500) ---
    if (message.trim() === '') {
        errors.message = 'Por favor ingresa tu mensaje';
        isValid = false;
    } else if (message.trim().length > 500) {
        errors.message = 'El mensaje no puede superar los 500 caracteres';
        isValid = false;
    }

    return { errors, isValid };
};

export const validateRegistration = (data, existingUsers = []) => {
    let errors = {};
    let isValid = true;
    const { fullname, email, password, phone, region, comuna, otraComuna } = data;

    // Fullname
    if (!fullname.trim()) { errors.fullname = 'Ingresa tu nombre completo.'; isValid = false; }
    
    // Email
    if (!EMAIL_PATTERN.test(email)) { 
        errors.email = 'El correo no es válido.'; isValid = false; 
    } else if (existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        errors.email = 'Ya existe una cuenta con ese correo.'; isValid = false;
    }

    // Password
    if (!PASSWORD_PATTERN.test(password)) { 
        errors.password = 'Contraseña debe tener al menos 8 dígitos.'; isValid = false; 
    }

    // Phone (Optional validation from snippet: digits only)
    if (phone && isNaN(phone)) { errors.phone = 'Teléfono solo puede contener números.'; isValid = false; }

    // Region & Comuna
    if (!region) { errors.region = 'Selecciona una región.'; isValid = false; }
    if (!comuna) { errors.comuna = 'Selecciona una comuna.'; isValid = false; }
    if (comuna === 'Otra' && !otraComuna.trim()) {
        errors.comuna = 'Escribe tu comuna en el campo "Otra comuna".'; isValid = false;
    }

    return { errors, isValid };
};

export const validateLogin = (data) => {
    let errors = {};
    let isValid = true;
    const { email, password } = data;

    if (!email.trim()) { errors.email = 'El correo es obligatorio.'; isValid = false; }
    if (!password.trim()) { errors.password = 'La contraseña es obligatoria.'; isValid = false; }
    
    return { errors, isValid };
};

