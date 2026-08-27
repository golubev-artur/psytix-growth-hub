export const NO_CONTACT_MESSAGE =
  "Оставьте email, телефон или контакт в мессенджере — иначе мы не сможем с вами связаться";

/**
 * Заявка полезна, только если по ней можно ответить.
 * Все контактные поля на сайте необязательные по отдельности —
 * проверяем, что заполнено хотя бы одно.
 */
export function hasContact(...values: (string | undefined | null)[]): boolean {
  return values.some((v) => Boolean(v && v.trim()));
}
