import QRCode from 'react-native-qrcode-svg';

export default function QrBase64({ valor, callback }) {
    function getRefHandler(c) {
        c && c.toDataURL(callback);
    }
    
    return (
        <QRCode
            value={valor}
            getRef={(c) => (getRefHandler(c))}
        />
    );
}
