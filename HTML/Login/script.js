const botaoOlho = document.querySelector('.olho');
const campoSenha = document.querySelector('.senha-container input');
const formLogin = document.querySelector('.login-form');
const campoEmail = document.querySelector('input[type="email"]');
 
const linkEsqueceu = document.querySelector('.esqueceu');
const overlayEsqueci = document.querySelector('#overlay-esqueci');
const btnCancelar = document.querySelector('.btn-cancelar');
const formEsqueci = document.querySelector('.form-esqueci');
const campoCpfEmail = document.querySelector('#cpf-email');
 
botaoOlho.addEventListener('click', function() {
    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
        botaoOlho.textContent = '—';
    } else {
        campoSenha.type = 'password';
        botaoOlho.textContent = '👁';
    }
});
 
formLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();
 
    const email = campoEmail.value;
    const senha = campoSenha.value;
 
    if (email === '' || senha === '') {
        alert('Preencha email e senha antes de continuar!');
        return;
    }
 
    alert('Login enviado! (aqui entraria a conexão com o servidor)');
});
 
linkEsqueceu.addEventListener('click', function(evento) {
    evento.preventDefault();
    overlayEsqueci.classList.add('ativo');
});
 
btnCancelar.addEventListener('click', function() {
    overlayEsqueci.classList.remove('ativo');
});
 
formEsqueci.addEventListener('submit', function(evento) {
    evento.preventDefault();
 
    const valor = campoCpfEmail.value;
 
    if (valor === '') {
        alert('Digite seu CPF ou email!');
        return;
    }
 
    alert('Link enviado! (aqui entraria a conexão com o servidor)');
    overlayEsqueci.classList.remove('ativo');
});