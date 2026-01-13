export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  if (!storedExpirationDate) return -1;

  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  
  // Cálculo en milisegundos
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}





export function getAuthToken() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return 'EXPIRED';
  }

  return token;
}
