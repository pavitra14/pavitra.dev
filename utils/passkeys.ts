import { getS3Object, putS3Object } from './s3';

export type Passkey = {
  id: string; // Base64URL-encoded credential ID
  publicKey: string; // Base64URL-encoded public key
  counter: number;
  transports?: string[];
};

export async function getPasskeys(): Promise<Passkey[]> {
  try {
    const data = await getS3Object('settings/passkeys.json');
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function savePasskey(passkey: Passkey) {
  const current = await getPasskeys();

  // Find if already exists and replace, else push
  const index = current.findIndex((p) => p.id === passkey.id);
  if (index >= 0) {
    current[index] = passkey;
  } else {
    current.push(passkey);
  }

  await putS3Object('settings/passkeys.json', JSON.stringify(current), 'application/json');
}

export async function removePasskey(id: string) {
  const current = await getPasskeys();
  const filtered = current.filter((p) => p.id !== id);
  await putS3Object('settings/passkeys.json', JSON.stringify(filtered), 'application/json');
}
