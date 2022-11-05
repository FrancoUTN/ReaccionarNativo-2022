const errors = {
  authErrors: {
    authInvalidEmail: 'El correo electronico ingresado tiene un formato invalido',
    authWrongPassword: 'La contraseña ingresada es invalida',
    authUserNotFound: 'No se encontro ningun usuario con este correo electronico',
    authEmailAlreadyInUse: 'El correo electronico ingresado ya esta en uso',
    authWeakPassword: 'La contraseña elegida no es segura, minimo 6 caracteres.',
    authTooManyRequests: 'El acceso a esta cuenta esta temporalmente deshabilitado, debido a demasiados intentos de ingreso fallidos.'
  }
}

function getFirebaseErrorMsg(error) {

  console.log(JSON.stringify(error))
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