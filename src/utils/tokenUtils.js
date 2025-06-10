import jwtDecode from 'jwt-decode';

// Verifica se o token JWT expirou (campo exp em segundos UNIX)
export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
      return false; // sem exp, assume válido
    }
    const now = Date.now().valueOf() / 1000; // em segundos
    return decoded.exp < now;
  } catch (err) {
    return true; // se inválido, trata como expirado
  }
}
