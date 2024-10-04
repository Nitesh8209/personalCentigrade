export const Credentials = {
  username: 'bidipta.paul@kreeti.com',
  password: 'Centigrade@2024',
};

export const InvalidCreadentials = [
  { 
      description: 'Invalid username', 
      username: 'InvalidUser@gmail.com',
      password: 'Centigrade@2024', 
      expectedStatusCode: 401, 
      expectedMessage: 'Invalid username or password' 
  },
  { 
      description: 'Invalid password', 
      username: 'bidipta.paul@kreeti.com', 
      password: 'InvalidPassword',
      expectedStatusCode: 401, 
      expectedMessage: 'Invalid username or password' 
  },
  { 
      description: 'Invalid username and password', 
      username: 'InvalidUser@gmail.com',
      password: 'InvalidPassword', 
      expectedStatusCode: 401, 
      expectedMessage: 'Invalid username or password' 
  },
  { 
      description: 'Empty fields', 
      username: '', 
      password: '', 
      expectedStatusCode: 400, 
      expectedMessage: 'Either username and password or client_id and client_secret must be provided' 
  }
];

export const apiUrl = 'https://devapi.centigrade.earth';
export const devUrl = 'https://devfoundry.centigrade.earth';
export const clientId = '3vt9mvi7g8brl86n35rqe5pf93';
export const expectedUsername = 'bpaul';
