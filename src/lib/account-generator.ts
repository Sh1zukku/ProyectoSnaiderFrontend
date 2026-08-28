export interface ParsedUserInput {
  name: string;
  email: string;
}

export interface GeneratedAccount extends ParsedUserInput {
  id: string;
  username: string;
  tempPassword: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ACCEPTED_EXTENSIONS = [".txt", ".json"] as const;

export function isAcceptedFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function assertValidUser(name: string, email: string, position: number): ParsedUserInput {
  if (!name) {
    throw new Error(`Registro ${position} inválido: falta el nombre.`);
  }
  if (!EMAIL_RE.test(email)) {
    throw new Error(`Registro ${position} inválido: el email "${email || "(vacío)"}" no es válido.`);
  }
  return { name, email };
}

/**
 * Parsea el archivo secundario de usuarios.
 * - .json: array de objetos con name/nombre y email/correo.
 * - .txt: una línea por usuario con formato `nombre,email` (también admite `;`).
 */
export function parseUsersFile(fileName: string, content: string): ParsedUserInput[] {
  if (fileName.toLowerCase().endsWith(".json")) {
    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch {
      throw new Error("El archivo JSON no tiene un formato válido.");
    }
    if (!Array.isArray(data)) {
      throw new Error("El JSON debe ser un array de usuarios, ej.: [{ \"name\": \"Ana\", \"email\": \"ana@mail.com\" }].");
    }
    if (data.length === 0) {
      throw new Error("El JSON no contiene ningún usuario.");
    }
    return data.map((item, i) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const name = String(record["name"] ?? record["nombre"] ?? "").trim();
      const email = String(record["email"] ?? record["correo"] ?? "").trim();
      return assertValidUser(name, email, i + 1);
    });
  }

  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    throw new Error("El archivo está vacío.");
  }
  return lines.map((line, i) => {
    const [name = "", email = ""] = line.split(/[,;]/).map((part) => part.trim());
    return assertValidUser(name, email, i + 1);
  });
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
}

function randomPassword(length = 10): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => charset[v % charset.length]).join("");
}

export function generateAccounts(users: ParsedUserInput[]): GeneratedAccount[] {
  const usedUsernames = new Set<string>();
  return users.map((user, index) => {
    const base = slugify(user.name) || slugify(user.email.split("@")[0] ?? "") || `usuario${index + 1}`;
    let username = base;
    let suffix = 2;
    while (usedUsernames.has(username)) {
      username = `${base}${suffix}`;
      suffix += 1;
    }
    usedUsernames.add(username);
    return {
      id: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      username,
      tempPassword: randomPassword(),
    };
  });
}