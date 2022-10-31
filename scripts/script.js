const backdrop = document.querySelector('.backdrop');
const navButton = document.querySelector('.navMenu');
const container = document.querySelector('.sidebarWithBackdrop');
const messagesContainer = document.querySelector('.messagesContainer');
const participants = document.querySelector('.participants');
const visibilityType = document.querySelector('.visibilityType');
const sendButton = document.querySelector('.sendButton');

const messageStatus = {
  contact: 'Todos',
  visibility: 'Público',
  from: '',
};

const loadCheck = () => {
  const { contact, visibility } = messageStatus;

  const currentContact = Array.from(document.querySelectorAll('.participantsButton')).filter((button) => button.firstElementChild.firstElementChild.nextElementSibling.outerText === contact);
  if (currentContact.length === 0) alert('Usuário escolhido saiu');
  const currentVisibility = Array.from(document.querySelectorAll('.participantsButton')).filter((button) => button.firstElementChild.firstElementChild.nextElementSibling.outerText === visibility);
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

  loginContainer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') button.click();
  });

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

  axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: value });
};

const participantsHandleClick = (event) => {
  let correctTarget = event.currentTarget;

  const contacts = document.querySelector('.participants');
  const visibility = document.querySelector('.visibilityType');

  const checkFromContacts = Array.from(contacts.children).map((contact) => contact.querySelector('.check'));
  const checkFromVisibility = Array.from(visibility.children).map((v) => v.querySelector('.check'));


  if (correctTarget.parentElement.className === 'visibilityType') {
    Array.from(checkFromVisibility).map((icon) => icon.classList.add('hideCheck'));
    messageStatus.visibility = correctTarget.firstElementChild.firstElementChild.nextElementSibling.innerHTML;
  } else {
    messageStatus.contact = correctTarget.firstElementChild.firstElementChild.nextElementSibling.innerHTML;
    Array.from(checkFromContacts).map((icon) => icon.classList.add('hideCheck'));
  }

  document.querySelector('.writeHere').innerHTML = (`Enviando para ${messageStatus.contact} (${messageStatus.visibility})`);

  correctTarget.firstElementChild.nextElementSibling.classList.remove('hideCheck');
};

const sendMessage = () => {
  const messageText = document.querySelector('.messageText').value;
  const { contact, visibility, from } = messageStatus;

  const messageObject = {
    from,
    to: contact,
    text: messageText,
    type: visibility === 'Público' ? 'message' : 'private_message',
  };

  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageObject)
    .then(() => {
      document.querySelector('.messageText').value = '';
      showMessages();
    })
    .catch(() => window.location.reload());
};
sendButton.addEventListener('click', sendMessage);
document.querySelector('.messageText').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') sendButton.click();
});

const showMessages = async () => {
  const messagesObject = await loadMessages();
  const { data } = messagesObject;

  Array.from(document.querySelectorAll('.messageBlock')).map((button) => button.remove());

  data.map(({ from, text, time, to, type }) => {
    const notForMe = type === 'private_message' && to !== messageStatus.from;
    const forMe = type === 'private_message' && to === messageStatus.from;

    const message = document.createElement('div');
    const messageTime = document.createElement('p');
    const messageAuthor = document.createElement('p');
    const messageText = document.createElement('p');

    message.classList.add('messageBlock');
    messageTime.classList.add('messageTime');
    messageText.classList.add('messageText');

    messageTime.innerHTML = `(${time})`;
    const forWho = `para <strong>${to}</strong>`;
    messageAuthor.innerHTML = `<strong>${from}</strong> ${forMe ? 'reservadamente' : ''} ${type === 'status' ? '' : forWho}`;
    messageText.innerHTML = text;

    if (notForMe) {
      message.remove();
      return;
    }
    if (forMe) message.classList.add('pink');
    if (type === 'status') message.classList.add('gray');

    messagesContainer.appendChild(message);
    message.appendChild(messageTime);
    message.appendChild(messageAuthor);
    message.appendChild(messageText);
  });

  const messages = document.querySelectorAll('.messageBlock');
  const lastMessage = messages[messages.length - 1];
  lastMessage.scrollIntoView();
};

const showParticipants = () => {
  const participantsObject = loadParticipants();

  participantsObject.then(({ data }) => {
    const newData = [{ name: 'Todos' }, { name: 'Público' }, { name: 'Reservadamente' }, ...data];

    Array.from(document.querySelectorAll('.participantsButton')).map((button) => button.remove());

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
    setInterval(() => showMessages(), 3000);
    setInterval(() => showParticipants(), 10000);
    showMessages();
    showParticipants();
  } else {
    alert('Por favor, entre com um nome de usuário diferente, pois este já está em uso.');
  }
};

const loginRequest = () => {
  const { value } = document.querySelector('.loginName');
  const data = {
    name: value,
  };
  messageStatus.from = value;

  const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', data);
  const fetched = request.then((response) => response).catch((error) => error);
  loginHandle(fetched);
};

window.addEventListener('load', buildLoginPage);
backdrop.addEventListener('click', toggleSideBarViaBackdrop);
navButton.addEventListener('click', toggleSideBarViaButton);
