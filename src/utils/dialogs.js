import { Alert, Platform } from 'react-native';

export function showMessage(title, message, onClose) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
    onClose?.();
  } else {
    Alert.alert(title, message, [{ text: 'Aceptar', onPress: onClose }]);
  }
}

export function confirmAction(title, message, onYes) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onYes();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'default', onPress: onYes },
    ]);
  }
}
