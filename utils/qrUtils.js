const QRCode = require('qrcode'); // Assuming you are using the 'qrcode' package for generating QR codes

// Function to generate a QR code
const generateQRCode = async (url) => {
  try {
    const qrCode = await QRCode.toDataURL(url);
    return qrCode;
  } catch (err) {
    throw new Error('QR code generation failed');
  }
};

module.exports = { generateQRCode };
