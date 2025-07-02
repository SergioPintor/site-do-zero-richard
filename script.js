// script.js

document.addEventListener('DOMContentLoaded', function() {
    // --- Variáveis da Autenticação ---
    const authPage = document.getElementById('auth-page');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const siteContent = document.getElementById('site-content');

    // Elementos do Login
    const loginForm = document.getElementById('login-form');
    const usernameLoginInput = document.getElementById('username-login');
    const passwordLoginInput = document.getElementById('password-login');
    const loginMessage = document.getElementById('login-message');
    const showRegisterLink = document.getElementById('show-register');

    // Elementos do Registro
    const registerForm = document.getElementById('register-form');
    const usernameRegisterInput = document.getElementById('username-register');
    const passwordRegisterInput = document.getElementById('password-register');
    const confirmPasswordRegisterInput = document.getElementById('confirm-password-register');
    const registerMessage = document.getElementById('register-message');
    const showLoginLink = document.getElementById('show-login');

    // Botão de Logout
    const logoutButton = document.getElementById('logout-button');

    // --- Armazenamento de usuários (ATENÇÃO: Não seguro para produção!) ---
    // Usaremos um objeto para armazenar usuários e senhas no localStorage
    // Formato: { "usuario1": "senha1", "usuario2": "senha2" }
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : {};
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // --- Funções para Alternar entre Login e Registro ---
    function showLoginSection() {
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        loginMessage.textContent = ''; // Limpa mensagens anteriores
        registerMessage.textContent = ''; // Limpa mensagens anteriores
    }

    function showRegisterSection() {
        registerSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
        loginMessage.textContent = ''; // Limpa mensagens anteriores
        registerMessage.textContent = ''; // Limpa mensagens anteriores
    }

    // --- Funções para Mostrar/Ocultar Páginas ---
    function showAuthPage() {
        authPage.classList.remove('hidden');
        siteContent.classList.add('hidden');
        document.title = "Login - Comédia Stand-Up Brasileira";
        showLoginSection(); // Garante que a seção de login seja a primeira a aparecer
    }

    function showSiteContent() {
        authPage.classList.add('hidden');
        siteContent.classList.remove('hidden');
        document.title = "Comédia Stand-Up Brasileira";
        // Rebuild o quiz ao mostrar o conteúdo do site
        buildQuiz();
        document.getElementById('submit-quiz').style.display = 'block';
        document.getElementById('quiz-result').innerHTML = '';
        document.getElementById('quiz-container').style.display = 'block';
    }

    // --- Event Listeners para Alternar Seções ---
    showRegisterLink.addEventListener('click', function(event) {
        event.preventDefault();
        showRegisterSection();
    });

    showLoginLink.addEventListener('click', function(event) {
        event.preventDefault();
        showLoginSection();
    });

    // --- Lógica de Registro ---
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = usernameRegisterInput.value.trim();
        const password = passwordRegisterInput.value;
        const confirmPassword = confirmPasswordRegisterInput.value;
        const users = getUsers();

        if (username.length < 3) {
            registerMessage.textContent = 'Usuário deve ter no mínimo 3 caracteres.';
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            return;
        }

        if (password.length < 6) {
            registerMessage.textContent = 'Senha deve ter no mínimo 6 caracteres.';
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            return;
        }

        if (password !== confirmPassword) {
            registerMessage.textContent = 'As senhas não coincidem.';
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            return;
        }

        if (users[username]) {
            registerMessage.textContent = 'Nome de usuário já existe.';
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            return;
        }

        // Se tudo estiver OK, registra o usuário
        users[username] = password; // Armazena a senha em texto puro (inseguro para produção!)
        saveUsers(users);

        registerMessage.textContent = 'Registro bem-sucedido! Agora faça login.';
        registerMessage.classList.remove('error-message');
        registerMessage.classList.add('success-message');

        // Opcional: Redirecionar para o login após registro
        setTimeout(() => {
            showLoginSection();
            usernameLoginInput.value = username; // Preenche o campo de usuário
            passwordLoginInput.value = ''; // Limpa o campo de senha
            loginMessage.textContent = 'Registro bem-sucedido! Faça login.';
            loginMessage.classList.remove('error-message');
            loginMessage.classList.add('success-message');
        }, 1500); // Espera 1.5 segundos antes de redirecionar
    });

    // --- Lógica de Login ---
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = usernameLoginInput.value.trim();
        const password = passwordLoginInput.value;
        const users = getUsers();

        if (users[username] && users[username] === password) {
            loginMessage.textContent = '';
            showSiteContent();
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUsername', username); // Armazena o usuário logado
        } else {
            loginMessage.textContent = 'Usuário ou senha incorretos.';
            loginMessage.classList.remove('success-message');
            loginMessage.classList.add('error-message');
        }
    });

    // --- Lógica de Logout ---
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUsername'); // Remove o usuário logado
        showAuthPage();
        usernameLoginInput.value = '';
        passwordLoginInput.value = '';
        loginMessage.textContent = '';
        registerMessage.textContent = ''; // Limpa mensagem de registro também
    });

    // --- Verificação inicial ao carregar a página ---
    if (localStorage.getItem('loggedIn') === 'true') {
        showSiteContent();
    } else {
        showAuthPage();
    }


    // --- Código do Quiz ---
    const questions = [
        {
            question: "Qual o nome do comediante que começou a ganhar força no início dos anos 2000, e é conhecido por ser um dos pioneiros do stand-up no Brasil?",
            options: ["Fábio Porchat", "Danilo Gentili", "Rafinha Bastos", "Thiago Ventura"],
            answer: "Fábio Porchat"
        },
        {
            question: "Além de casas de comédia especializadas e teatros, onde mais você pode assistir a shows de stand-up?",
            options: ["Apenas em bares", "Apenas em pubs", "Bares e pubs", "Em nenhum dos anteriores"],
            answer: "Bares e pubs"
        },
        {
            question: "Qual o formato de apresentação humorística onde o comediante se apresenta sozinho, falando diretamente para a plateia?",
            options: ["Improviso", "Skit", "Stand-up comedy", "Teatro de revista"],
            answer: "Stand-up comedy"
        },
        {
            question: "Além do humor de observações do cotidiano e experiências pessoais, de que outra forma o humor no stand-up pode surgir?",
            options: ["Apenas de improvisos", "Apenas de músicas", "Críticas sociais e políticas", "De mímicas"],
            answer: "Críticas sociais e políticas"
        },
        {
            question: "Qual desses comediantes é mencionado como um dos principais no stand-up brasileiro no site?",
            options: ["Whindersson Nunes", "Felipe Neto", "Tatá Werneck", "Carlinhos Maia"],
            answer: "Tatá Werneck"
        },
        {
            question: "No Brasil, qual período viu o stand-up comedy ganhar mais força?",
            options: ["Anos 90", "Início dos anos 2000", "Anos 80", "2010 em diante"],
            answer: "Início dos anos 2000"
        },
        {
            question: "Que tipo de grupo foi pioneiro e ajudou a popularizar o stand-up no Brasil?",
            options: ["Grupos de teatro dramático", "Bandas musicais", "Clubes de comédia", "Grupos de dança"],
            answer: "Clubes de comédia"
        },
        {
            question: "Quem é um comediante conhecido por seus especiais de stand-up em plataformas de streaming?",
            options: ["Chico Anysio", "Jô Soares", "Thiago Ventura", "Ronald Golias"],
            answer: "Thiago Ventura"
        },
        {
            question: "Qual é a característica principal do comediante em um show de stand-up?",
            options: ["Ele se apresenta com vários parceiros", "Ele usa fantasias elaboradas", "Ele se apresenta sozinho no palco", "Ele interage apenas com objetos"],
            answer: "Ele se apresenta sozinho no palco"
        },
        {
            question: "O que o Brasil possui hoje em relação à cena de stand-up?",
            options: ["Uma cena estagnada", "Uma cena em declínio", "Uma cena vibrante e diversificada", "Uma cena inexistente"],
            answer: "Uma cena vibrante e diversificada"
        }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-quiz');
    const resultDiv = document.getElementById('quiz-result');

    function buildQuiz() {
        quizContainer.innerHTML = ''; // Limpa o quiz antes de reconstruir
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            questionDiv.innerHTML = `<p>${index + 1}. ${q.question}</p><div class="options"></div>`;

            const optionsDiv = questionDiv.querySelector('.options');
            q.options.forEach(option => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="question${index}" value="${option}">
                    ${option}
                `;
                optionsDiv.appendChild(label);
            });
            quizContainer.appendChild(questionDiv);
        });
    }

    function showResults() {
        let score = 0;
        let allAnswered = true;

        questions.forEach((q, index) => {
            const selector = `input[name=question${index}]:checked`;
            const userAnswer = (quizContainer.querySelector(selector) || {}).value;

            if (!userAnswer) {
                allAnswered = false;
            }

            if (userAnswer === q.answer) {
                score++;
            }
        });

        if (!allAnswered) {
            resultDiv.innerHTML = '<span class="error-message">Por favor, responda a todas as perguntas antes de ver o resultado!</span>';
            return;
        }

        resultDiv.innerHTML = `Você acertou ${score} de ${questions.length} perguntas!`;
        if (score === questions.length) {
            resultDiv.innerHTML += '<br>Parabéns, você é um mestre da comédia stand-up brasileira!';
        } else if (score >= questions.length / 2) {
            resultDiv.innerHTML += '<br>Muito bom! Você conhece bastante sobre stand-up!';
        } else {
            resultDiv.innerHTML += '<br>Continue estudando para se tornar um expert!';
        }

        submitButton.style.display = 'none';
        quizContainer.style.display = 'none';
    }

    submitButton.addEventListener('click', showResults);
});
