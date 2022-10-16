import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '../ui/Button';
import FlatButton from '../ui/FlatButton';
import Input from './Input';

function AuthForm({ onSubmit, credentialsInvalid, correo, clave }) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const {
    email: emailIsInvalid,
    password: passwordIsInvalid
  } = credentialsInvalid;

  useEffect(
    () => {
      setEnteredEmail(correo);
      setEnteredPassword(clave);
    }, [correo, clave]
  );

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      password: enteredPassword
    });
  }

  return (
    <View style={styles.form}>
      <View>
        <Input
          label="Correo electrónico"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        <Input
          label="Contraseña"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            Ingresar
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
