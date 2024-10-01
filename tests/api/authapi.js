const apiHelper = require('./util/apihelper');

test('should successfully login with valid credentials', async () => {
    const token = await apiHelper.login('prithika.sujith@kreeti.com', 'Welcome@123');
    const headers = apiHelper.setAuthHeader(token);
    
    const response = await apiHelper.getRequest('https://devapi.centigrade.earth/project', headers);
    apiHelper.checkResponseStatus(response, 200);
    
    
});
