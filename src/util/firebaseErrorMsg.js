const errors = {
  authErrors: {
    authInvalidEmail: 'El correo electrónico ingresado tiene un formato inválido.',
    authWrongPassword: 'La contraseña ingresada es inválida.',
    authUserNotFound: 'No se encontró ningún usuario con este correo electrónico.',
    authEmailAlreadyInUse: 'El correo electrónico ingresado ya está en uso',
    authWeakPassword: 'La contraseña elegida no es segura: mínimo 6 caracteres.',
    authTooManyRequests: 'El acceso a esta cuenta está temporalmente deshabilitado debido a demasiados intentos de ingreso fallidos.'
  }
}

function getFirebaseErrorMsg(error) {
  if (!error) {
    return "";
  }

  switch (error.code) {
    case 'auth/invalid-email': {
      return errors.authErrors.authInvalidEmail;
    }
    case 'auth/wrong-password': {
      return errors.authErrors.authWrongPassword;
    }
    case 'auth/user-not-found': {
      return errors.authErrors.authUserNotFound;
    }
    case 'auth/email-already-in-use': {
      return errors.authErrors.authEmailAlreadyInUse;
    }
    case 'auth/weak-password': {
      return errors.authErrors.authWeakPassword;
    }
    case 'auth/too-many-requests': {
      return errors.authErrors.authTooManyRequests;
    }
    default:
      return "Falló la autenticación. Intenta nuevamente";
  }
}

export default getFirebaseErrorMsg;