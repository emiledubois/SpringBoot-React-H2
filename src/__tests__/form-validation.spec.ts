describe('Form Validation Test', () => {
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  function validateForm(email: string, phone: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!email) {
      errors.push('El email es requerido');
    } else if (!validateEmail(email)) {
      errors.push('Email inválido');
    }

    if (!phone) {
      errors.push('El teléfono es requerido');
    } else if (!validatePhone(phone)) {
      errors.push('Teléfono debe tener 9 dígitos');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  it('Test 10: Validación de email correcto', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('usuario@gmail.com')).toBe(true);
  });

  it('Test 10b: Validación de email incorrecto', () => {
    expect(validateEmail('invalido')).toBe(false);
    expect(validateEmail('sin@dominio')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('Test 10c: Validación de teléfono correcto', () => {
    expect(validatePhone('912345678')).toBe(true);
    expect(validatePhone('987654321')).toBe(true);
  });

  it('Test 10d: Validación de teléfono incorrecto', () => {
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('abcdefghi')).toBe(false);
    expect(validatePhone('')).toBe(false);
  });

  it('Test 10e: Validación completa del formulario', () => {
    const result1 = validateForm('test@example.com', '912345678');
    expect(result1.isValid).toBe(true);
    expect(result1.errors.length).toBe(0);

    const result2 = validateForm('', '');
    expect(result2.isValid).toBe(false);
    expect(result2.errors.length).toBeGreaterThan(0);

    const result3 = validateForm('invalido', '123');
    expect(result3.isValid).toBe(false);
    expect(result3.errors).toContain('Email inválido');
    expect(result3.errors).toContain('Teléfono debe tener 9 dígitos');
  });
});
