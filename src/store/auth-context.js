import { createContext, useState } from 'react';

export const AuthContext = createContext({
  email: '',
  perfil: '',
  authenticate: (email, perfil) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [email, setEmail] = useState();
  const [perfil, setPerfil] = useState();

  function authenticate(email, perfil) {
    setEmail(email);
    setPerfil(perfil);
  }

  function logout() {
    setEmail(null);
    setPerfil(null);
  }

  const value = {
    email: email,
    perfil: perfil,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
