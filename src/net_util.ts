function _signature(
  method: string,
  relative_url: string,
  request_random_string: string,
  timestamp: number,
  request_body?: string,
): string {
  let target: string[] = [
    method,
    relative_url,
    timestamp.toString(),
    request_random_string,
  ];
  if (typeof request_body == "object") {
    target.push(request_body);
  }
  target.push("");
  return target.join("\n");
}

async function calculateHMACSHA1(input: string, key: string) {
  const encoder = new TextEncoder();
  const encodedKey = encoder.encode(key);
  const encodedData = encoder.encode(input);
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    encodedKey,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", hmacKey, encodedData);
  const base64String = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const urlSafeBase64 = base64String.replace(/\+/g, "-").replace(/\//g, "_");
  // .replace(/=+$/, "");
  return urlSafeBase64;
}

function generateRandomString() {
  const randomArray = new Uint8Array(16);
  crypto.getRandomValues(randomArray);
  return Array.from(randomArray, (byte) => byte.toString(16).toUpperCase())
    .join("");
}
export async function signatureDubbing(
  method: string,
  relative_url: string,
  accessKey: string,
  secretKey: string,
  data?: string,
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = generateRandomString();
  const signature = await calculateHMACSHA1(
    _signature(method, relative_url, nonce, timestamp, data),
    secretKey,
  );
  return `access_key="${accessKey}",timestamp="${timestamp}",nonce="${nonce}",signature="${signature}"`;
}
