const backdrop = document.querySelector('.backdrop');
const navButton = document.querySelector('.navMenu');
const container = document.querySelector('.sidebarWithBackdrop');
const messagesContainer = document.querySelector('.messagesContainer');
const participants = document.querySelector('.participants');
const visibilityType = document.querySelector('.visibilityType');

const messageStatus = {
  contact: 'Todos',
  visibility: 'Público',
};

const loadCheck = () => {
  const { contact, visibility } = messageStatus;
  // console.log(Array.from(document.querySelectorAll('.participantName'))[0].outerText)

  const currentContact = Array.from(document.querySelectorAll('.participantsButton')).filter((button) => button.firstElementChild.firstElementChild.nextElementSibling.outerText === contact);
  const currentVisibility = Array.from(document.querySelectorAll('.participantsButton')).filter((button) => button.firstElementChild.firstElementChild.nextElementSibling.outerText === visibility);
  console.log(document.querySelector('.check'), currentContact[0])
  currentContact[0].firstElementChild.nextElementSibling.classList.remove('hideCheck');
  currentVisibility[0].firstElementChild.nextElementSibling.classList.remove('hideCheck');
};

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
  // request.then((r) => console.log(r));
};

const participantsHandleClick = (event) => {
  // console.log(event.target, event.currentTarget);
  let correctTarget = event.currentTarget;

  const contacts = document.querySelector('.participants');
  const visibility = document.querySelector('.visibilityType');

  const checkFromContacts = Array.from(contacts.children).map((contact) => contact.querySelector('.check'));
  const checkFromVisibility = Array.from(visibility.children).map((v) => v.querySelector('.check'));

  console.log(correctTarget.parentElement.className)

  if (correctTarget.parentElement.className === 'visibilityType') {
    Array.from(checkFromVisibility).map((icon) => icon.classList.add('hideCheck'));
  } else {
    Array.from(checkFromContacts).map((icon) => icon.classList.add('hideCheck'));
    console.log(checkFromContacts)
  }

  correctTarget.firstElementChild.nextElementSibling.classList.remove('hideCheck');

  // if (event.target !== event.currentTarget) {
  //   correctTarget = event.target;
  // }

  console.log(correctTarget);
};

const sendMessage = () => {
  const messageText = document.querySelector('.messageText');

};

const showMessages = () => {
  const messagesObject = loadMessages();
  messagesObject.then(({ data }) => {
    console.log(data);

    data.map(({ from, text, time, to, type }) => {
      const message = document.createElement('div');
      const messageTime = document.createElement('p');
      const messageAuthor = document.createElement('p');
      const messageTo = document.createElement('p');
      const messageText = document.createElement('p');

      message.classList.add('messageBlock');
      messageTime.classList.add('messageTime');
      messageAuthor.classList.add('messageAuthor');
      messageTo.classList.add('messageTo');
      messageText.classList.add('messageText');

      messageTime.innerHTML = `(${time})`;
      messageAuthor.innerHTML = from;
      messageText.innerHTML = text;

      messagesContainer.appendChild(message);
      message.appendChild(messageTime);
      message.appendChild(messageAuthor);
      message.appendChild(messageText);

      switch (type) {
        case 'status':

      }
    });
  });
};

const showParticipants = () => {
  const participantsObject = loadParticipants();

  participantsObject.then(({ data }) => {
    console.log(data);
    const newData = [{ name: 'Todos' }, { name: 'Público' }, { name: 'Reservadamente' }, ...data];

    newData.map(({ name }) => {
      const visibility = name === 'Público' || name === 'Reservadamente';

      const participantsButton = document.createElement('div');
      const participantsInfo = document.createElement('div');
      const participantName = document.createElement('p');
      const userIcon = document.createElement('ion-icon');
      const checkIcon = document.createElement('ion-icon');

      participantsButton.classList.add('participantsButton');
      participantsInfo.classList.add('participantsInfo');
      checkIcon.classList.add('hideCheck');
      checkIcon.classList.add('check');
      participantName.classList.add('participantName');

      participantName.innerHTML = name;

      checkIcon.name = 'checkmark';

      switch (name) {
        case 'Todos':
          userIcon.name = 'people';
          break;
        case 'Público':
          userIcon.name = 'lock-open';
          break;
        case 'Reservadamente':
          userIcon.name = 'lock-closed';
          break;
        default:
          userIcon.name = 'person-circle';
          break;
      }

      participantsButton.addEventListener('click', participantsHandleClick);

      (visibility ? visibilityType : participants).appendChild(participantsButton);
      participantsButton.appendChild(participantsInfo);
      participantsInfo.appendChild(userIcon);
      participantsInfo.appendChild(participantName);
      participantsButton.appendChild(checkIcon);
    });
    loadCheck();
  });
};

const loadParticipants = () => {
  return axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then((response) => response);
};

const loadMessages = () => {
  return axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then((response) => response);
};

const loginHandle = async (response) => {
  const fetched = await response;

  if (fetched.status === 200) {
    const loginContainer = document.querySelector('.loginContainer');
    loginContainer.classList.add('hideLogin');

    setInterval(() => keepConnection(), 5000);
    showMessages();
    showParticipants();
  } else {
    console.log(fetched)
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
