import QRCode from 'react-native-qrcode-svg';

export default function Qr({ valor, size }) {
    return(
        <QRCode
            value={valor}
            size={size}
        />
    );
}
