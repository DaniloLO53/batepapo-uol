const backdrop = document.querySelector('.backdrop');
const navButton = document.querySelector('.navMenu');
const container = document.querySelector('.sidebarWithBackdrop');

const toggleSideBarViaButton = () => {
  container.className = 'sidebarWithBackdrop active';
  backdrop.className = 'backdrop show';
};

const toggleSideBarViaBackdrop = () => {
  container.className = 'sidebarWithBackdrop inactive';
  backdrop.className = 'backdrop hide';
};

const buildLoginPage = () => {
  const body = document.querySelector('body');

  const loginContainer = document.createElement('div');
  const figure = document.createElement('figure');
  const figureImage = document.createElement('img');
  const input = document.createElement('input');
  const button = document.createElement('button');

  loginContainer.classList.add('loginContainer');
  input.classList.add('loginName');
  button.classList.add('loginButton');

  figureImage.src = './assets/images/logo 1@2x.png';
  input.placeholder = 'Digite seu nome';
  button.setAttribute('type', 'button');

  button.innerHTML = 'Entrar';

  body.prepend(loginContainer);
  loginContainer.appendChild(figure);
  loginContainer.appendChild(input);
  loginContainer.appendChild(button);
  figure.appendChild(figureImage);

  button.addEventListener('click', loginRequest);
};

const keepConnection = () => {
  const { value } = document.querySelector('.loginName');
  const data = {
    name: value,
  };

  console.log('keep')
  const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', data);
  request.then((r) => console.log(r));
};

const loadMessages = async () => {
  const request = await axios.get('http://mock-api.driven.com.br/api/v6/uol/messages');
  console.log(request);
};

const loginHandle = async (response) => {
  const fetched = await response;
  const fetchedJson = await fetched.json();
  console.log(fetchedJson);

  if (fetched.status === 200) {
    const loginContainer = document.querySelector('.loginContainer');
    loginContainer.classList.add('hideLogin');

    // setInterval(() => keepConnection(), 5000);
    loadMessages();
  } else {
    alert('Por favor, entre com um nome de usuário diferente, pois este já está em uso.');
  }
};

const loginRequest = () => {
  const { value } = document.querySelector('.loginName');
  const data = {
    name: value,
  };

  const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', data);
  const fetched = request.then((response) => response).catch((error) => error);
  loginHandle(fetched);
};


window.addEventListener('load', buildLoginPage);
backdrop.addEventListener('click', toggleSideBarViaBackdrop);
navButton.addEventListener('click', toggleSideBarViaButton);
