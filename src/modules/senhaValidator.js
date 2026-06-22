/**
 * Valida os requisitos de senha:
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos um número
 * - Pelo menos um caractere especial
 */
function validarSenha(senha) {
  const erros = [];

  if (!senha || senha.length < 8) {
    erros.push('A senha deve ter no mínimo 8 caracteres.');
  }
  if (!/[A-Z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra maiúscula.');
  }
  if (!/[0-9]/.test(senha)) {
    erros.push('A senha deve conter pelo menos um número.');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
    erros.push('A senha deve conter pelo menos um caractere especial.');
  }

  return erros;
}

module.exports = { validarSenha };
