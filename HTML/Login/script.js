 
// Chaves usadas no localStorage
const CHAVE_USUARIOS = 'medicaMaisUsuarios';
const CHAVE_LEMBRAR = 'medicaMaisLembrar';
const CHAVE_LOGADO = 'medicaMaisUsuarioLogado';
 
/* ---------- Funcoes auxiliares de mensagem ---------- */
function mostrarMensagem(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.classList.remove('sucesso');
    if (tipo === 'sucesso') {
        elemento.classList.add('sucesso');
    }
    elemento.classList.add('mostrar');
}
 
function esconderMensagem(elemento) {
    elemento.textContent = '';
    elemento.classList.remove('mostrar', 'sucesso');
}
 
function ehEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
 
/* ---------- Funcoes de armazenamento (localStorage) ---------- */
function obterUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    } catch (e) {
        return [];
    }
}
 
function salvarUsuarios(lista) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
}
 
function buscarUsuarioPorEmail(email) {
    const emailNormalizado = email.trim().toLowerCase();
    return obterUsuarios().find(function (u) {
        return u.email === emailNormalizado;
    });
}
 
/* ---------- Elementos: Login ---------- */
const botaoOlho = document.querySelector('.olho');
const campoSenha = document.querySelector('.senha-container input');
const formLogin = document.querySelector('.login-form');
const campoEmail = document.querySelector('input[type="email"]');
const erroLogin = document.querySelector('#erro-login');
const erroEmail = document.querySelector('#erro-email');
const lembrarSenha = document.querySelector('#lembrar-senha');
 
/* ---------- Elementos: Esqueci a senha ---------- */
const linkEsqueceu = document.querySelector('.esqueceu');
const overlayEsqueci = document.querySelector('#overlay-esqueci');
const btnCancelar = document.querySelector('.btn-cancelar');
const formEsqueci = document.querySelector('.form-esqueci');
const campoCpfEmail = document.querySelector('#cpf-email');
const erroEsqueci = document.querySelector('#erro-esqueci');
 
/* ---------- Elementos: Cadastro ---------- */
const linkCadastro = document.querySelector('.cadastro strong');
const overlayCadastro = document.querySelector('#overlay-cadastro');
const btnCancelarCadastro = document.querySelector('#cancelar-cadastro');
const formCadastro = document.querySelector('.form-cadastro');
const erroCadastro = document.querySelector('#erro-cadastro');
const erroCpf = document.querySelector('#erro-cpf');
const campoCpf = document.querySelector('#cpf');
const campoNome = document.querySelector('#nome');
const campoEmailCadastro = document.querySelector('#email-cadastro');
const erroEmailCadastro = document.querySelector('#erro-email-cadastro');
const campoSenhaCadastro = document.querySelector('#senha-cadastro');
const campoConfirmaSenha = document.querySelector('#confirma-senha');
 
/* ---------- Ao abrir a pagina: preenche o email lembrado ---------- */
window.addEventListener('DOMContentLoaded', function () {
    const emailLembrado = localStorage.getItem(CHAVE_LEMBRAR);
    if (emailLembrado) {
        campoEmail.value = emailLembrado;
        if (lembrarSenha) {
            lembrarSenha.checked = true;
        }
    }
});
 
/* ---------- Mostrar / esconder senha ---------- */
botaoOlho.addEventListener('click', function () {
    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
        botaoOlho.textContent = '--';
    } else {
        campoSenha.type = 'password';
        botaoOlho.textContent = '👁';
    }
});
 
/* ---------- LOGIN ---------- */
formLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();
    esconderMensagem(erroLogin);
    esconderMensagem(erroEmail);
 
    const email = campoEmail.value.trim();
    const senha = campoSenha.value;
 
    if (email === '' || senha === '') {
        mostrarMensagem(erroLogin, 'Preencha o email e a senha para continuar.', 'erro');
        return;
    }
 
    if (!ehEmailValido(email)) {
        mostrarMensagem(erroEmail, 'Digite um email válido, como exemplo@gmail.com.', 'erro');
        return;
    }
 
    const usuario = buscarUsuarioPorEmail(email);
 
    if (!usuario) {
        mostrarMensagem(erroLogin, 'Email não encontrado. Clique em "cadastre-se" para criar sua conta.', 'erro');
        return;
    }
 
    if (usuario.senha !== senha) {
        mostrarMensagem(erroLogin, 'Senha incorreta. Verifique e tente novamente.', 'erro');
        return;
    }
 
    // Guarda a preferencia de "lembrar senha"
    if (lembrarSenha && lembrarSenha.checked) {
        localStorage.setItem(CHAVE_LEMBRAR, email.toLowerCase());
    } else {
        localStorage.removeItem(CHAVE_LEMBRAR);
    }
 
    // Guarda quem esta logado (a pagina logada pode ler isso)
    localStorage.setItem(CHAVE_LOGADO, JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel
    }));
 
    const primeiroNome = usuario.nome ? usuario.nome.split(' ')[0] : '';
    mostrarMensagem(erroLogin, 'Login realizado com sucesso! Bem-vindo(a), ' + primeiroNome + '. Redirecionando...', 'sucesso');
 
    setTimeout(function () {
        window.location.href = '../Logado/index.html';
    }, 1500);
});
 
/* ---------- ESQUECI A SENHA ---------- */
linkEsqueceu.addEventListener('click', function (evento) {
    evento.preventDefault();
    overlayEsqueci.classList.add('ativo');
});
 
btnCancelar.addEventListener('click', function () {
    overlayEsqueci.classList.remove('ativo');
    esconderMensagem(erroEsqueci);
});
 
formEsqueci.addEventListener('submit', function (evento) {
    evento.preventDefault();
    esconderMensagem(erroEsqueci);
 
    const valor = campoCpfEmail.value.trim();
    const pareceEmail = valor.includes('@');
    const semFormatacao = valor.replace(/[.\-\s]/g, '');
    const ehCpfValido = /^\d{11}$/.test(semFormatacao);
 
    if (valor === '') {
        mostrarMensagem(erroEsqueci, 'Digite seu CPF ou email para continuar.', 'erro');
        return;
    }
 
    if (!pareceEmail && !ehCpfValido) {
        mostrarMensagem(erroEsqueci, 'Digite um CPF com 11 números ou um email válido.', 'erro');
        return;
    }
 
    mostrarMensagem(erroEsqueci, 'Pronto! Enviamos um link de recuperação. Verifique seu email (e a caixa de spam).', 'sucesso');
 
    setTimeout(function () {
        overlayEsqueci.classList.remove('ativo');
        esconderMensagem(erroEsqueci);
        formEsqueci.reset();
    }, 2500);
});
 
/* ---------- CADASTRO ---------- */
linkCadastro.addEventListener('click', function () {
    overlayCadastro.classList.add('ativo');
});
 
btnCancelarCadastro.addEventListener('click', function () {
    overlayCadastro.classList.remove('ativo');
    esconderMensagem(erroCadastro);
    esconderMensagem(erroCpf);
    esconderMensagem(erroEmailCadastro);
});
 
formCadastro.addEventListener('submit', function (evento) {
    evento.preventDefault();
    esconderMensagem(erroCadastro);
    esconderMensagem(erroCpf);
    esconderMensagem(erroEmailCadastro);
 
    const nome = campoNome.value.trim();
    const email = campoEmailCadastro.value.trim();
    const senha = campoSenhaCadastro.value;
    const confirmaSenha = campoConfirmaSenha.value;
    const papelSelecionado = document.querySelector('input[name="papel"]:checked');
 
    if (nome === '') {
        mostrarMensagem(erroCadastro, 'Digite seu nome completo.', 'erro');
        return;
    }
 
    if (campoCpf.value.length !== 11) {
        mostrarMensagem(erroCpf, 'O CPF deve ter 11 números.', 'erro');
        return;
    }
 
    if (!ehEmailValido(email)) {
        mostrarMensagem(erroEmailCadastro, 'Digite um email válido, como exemplo@gmail.com.', 'erro');
        return;
    }
 
    if (!papelSelecionado) {
        mostrarMensagem(erroCadastro, 'Selecione se você é Cuidador, Paciente ou Parente.', 'erro');
        return;
    }
 
    if (senha.length < 6) {
        mostrarMensagem(erroCadastro, 'A senha deve ter no mínimo 6 caracteres.', 'erro');
        return;
    }
 
    if (senha !== confirmaSenha) {
        mostrarMensagem(erroCadastro, 'As senhas não coincidem. Digite a mesma senha nos dois campos.', 'erro');
        return;
    }
 
    // Nao deixa cadastrar dois usuarios com o mesmo email
    if (buscarUsuarioPorEmail(email)) {
        mostrarMensagem(erroEmailCadastro, 'Este email já está cadastrado. Faça login ou use outro email.', 'erro');
        return;
    }
 
    // Salva o novo usuario
    const usuarios = obterUsuarios();
    usuarios.push({
        nome: nome,
        cpf: campoCpf.value,
        email: email.toLowerCase(),
        senha: senha,
        papel: papelSelecionado.value
    });
    salvarUsuarios(usuarios);
 
    mostrarMensagem(erroCadastro, 'Cadastro realizado com sucesso! Agora é só fazer login com seu email e senha.', 'sucesso');
 
    // Ja deixa o email preenchido na tela de login
    campoEmail.value = email.toLowerCase();
 
    setTimeout(function () {
        overlayCadastro.classList.remove('ativo');
        esconderMensagem(erroCadastro);
        formCadastro.reset();
    }, 2500);
});
 
/* ---------- CPF: aceita apenas numeros (max 11) ---------- */
campoCpf.addEventListener('input', function () {
    let valor = campoCpf.value.replace(/\D/g, '');
    valor = valor.slice(0, 11);
    campoCpf.value = valor;
});
 