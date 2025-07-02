// script.js

document.addEventListener('DOMContentLoaded', function() {
    // --- Variáveis do Login ---
    const loginPage = document.getElementById('login-page');
    const siteContent = document.getElementById('site-content');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');
    const logoutButton = document.getElementById('logout-button');

    // --- Credenciais de exemplo (ATENÇÃO: Não seguro para produção!) ---
    const CORRECT_USERNAME = 'user';
    const CORRECT_PASSWORD = 'password';

    // --- Funções de Login ---
    function showLoginPage() {
        loginPage.classList.remove('hidden');
        siteContent.classList.add('hidden');
        document.title = "Login - Comédia Stand-Up Brasileira"; // Atualiza o título da página
    }

    function showSiteContent() {
        loginPage.classList.add('hidden');
        siteContent.classList.remove('hidden');
        document.title = "Comédia Stand-Up Brasileira"; // Volta o título original
        // Importante: Rebuild o quiz ao mostrar o conteúdo do site
        // Isso é necessário caso o usuário faça logout e depois login novamente
        buildQuiz();
        // Garante que o botão de submissão do quiz esteja visível
        document.getElementById('submit-quiz').style.display = 'block';
        // Limpa o resultado do quiz anterior
        document.getElementById('quiz-result').innerHTML = '';
        // Garante que o quiz-container esteja visível
        document.getElementById('quiz-container').style.display = 'block';
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
            loginMessage.textContent = ''; // Limpa qualquer mensagem de erro
            showSiteContent();
            // Salva um estado de login no localStorage (para persistir a sessão simples)
            localStorage.setItem('loggedIn', 'true');
        } else {
            loginMessage.textContent = 'Usuário ou senha incorretos.';
        }
    });

    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('loggedIn'); // Remove o estado de login
        showLoginPage();
        // Limpa os campos do formulário de login ao fazer logout
        usernameInput.value = '';
        passwordInput.value = '';
        loginMessage.textContent = '';
    });

    // Verifica se o usuário já está logado ao carregar a página
    if (localStorage.getItem('loggedIn') === 'true') {
        showSiteContent();
    } else {
        showLoginPage();
    }


    // --- Código do Quiz (já existente, movido para dentro do DOMContentLoaded) ---
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
        // Limpa o quiz antes de reconstruir para evitar perguntas duplicadas
        quizContainer.innerHTML = '';
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
        //submitButton.style.display = 'block'; // Mostra o botão ao carregar o quiz (agora controlado por showSiteContent)
    }

    function showResults() {
        let score = 0;
        let allAnswered = true; // Flag para verificar se todas as perguntas foram respondidas

        questions.forEach((q, index) => {
            const selector = `input[name=question${index}]:checked`;
            const userAnswer = (quizContainer.querySelector(selector) || {}).value;

            if (!userAnswer) {
                allAnswered = false; // Se uma pergunta não foi respondida, define a flag como false
            }

            if (userAnswer === q.answer) {
                score++;
            }
        });

        if (!allAnswered) {
            resultDiv.innerHTML = '<span style="color: red;">Por favor, responda a todas as perguntas antes de ver o resultado!</span>';
            return; // Interrompe a função se nem todas as perguntas foram respondidas
        }

        resultDiv.innerHTML = `Você acertou ${score} de ${questions.length} perguntas!`;
        if (score === questions.length) {
            resultDiv.innerHTML += '<br>Parabéns, você é um mestre da comédia stand-up brasileira!';
        } else if (score >= questions.length / 2) {
            resultDiv.innerHTML += '<br>Muito bom! Você conhece bastante sobre stand-up!';
        } else {
            resultDiv.innerHTML += '<br>Continue estudando para se tornar um expert!';
        }

        // Esconde o botão e o quiz após mostrar o resultado (opcional)
        submitButton.style.display = 'none';
        quizContainer.style.display = 'none';
    }

    // Adiciona o evento de clique ao botão de submissão do quiz
    submitButton.addEventListener('click', showResults);
});
