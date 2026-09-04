export function getCallablePhoneNumber(phone: string): string {
  if (!phone) return '';
  // If multiple numbers are separated by slash, take the first one
  const firstPhone = phone.split('/')[0];
  // Remove all non-numeric characters for the tel: link
  return firstPhone.replace(/[^0-9]/g, '');
}
