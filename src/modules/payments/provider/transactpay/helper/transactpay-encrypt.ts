import forge from "node-forge";
import { DOMParser } from "xmldom";

const { BigInteger } = forge.jsbn;

/**
 * Encrypt data using RSA public key.
 *
 * @param {string} data - The data to encrypt.
 * @param {string} rsaPubKey - The RSA public key in base64 XML format.
 * @returns {string} - The encrypted data in base64 encoding.
 */
export function encryptForge(data: unknown, rsaPubKey: string) {
  // Decode the base64 encoded public key and remove the prefix
  let rsaKeyValue = Buffer.from(rsaPubKey, "base64").toString("utf-8");
  rsaKeyValue = rsaKeyValue.replace("4096!", "");

  // Parse the XML to extract Modulus and Exponent
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rsaKeyValue, "text/xml");
  const modulus = xmlDoc.getElementsByTagName("Modulus")[0].textContent;
  const exponent = xmlDoc.getElementsByTagName("Exponent")[0].textContent;

  if (!(modulus && exponent)) {
    throw new Error("Unable to determine modulus or exponent");
  }

  // Convert the Modulus and Exponent from base64 to BigInteger
  const modulusBI = parseBigInteger(modulus);
  const exponentBI = parseBigInteger(exponent);

  // Set up the RSA public key
  const pubKey = forge.pki.setRsaPublicKey(modulusBI, exponentBI);

  // Encrypt the data
  //const encryptedBytes = pubKey.encrypt(forge.util.encodeUtf8(data));
  const encryptedBytes = pubKey.encrypt(
    forge.util.encodeUtf8(JSON.stringify(data))
  );

  // Return the encrypted text in base64 encoding
  return Buffer.from(encryptedBytes, "binary").toString("base64");
}

/**
 * Convert a base64 encoded string to a BigInteger.
 *
 * @param {string} b64 - The base64 encoded string.
 * @returns {BigInteger} - The BigInteger representation of the string.
 */
function parseBigInteger(b64: string) {
  const decoded = forge.util.decode64(b64);
  return new BigInteger(forge.util.createBuffer(decoded).toHex(), 16);
}
