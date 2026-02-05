const axios = require('axios');
const https = require('https');

const authenticate = async (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if (!username || !password) {
    return res.status(401).json({
      status: 'error',
      message: 'username and password headers required'
    });
  }

  try {
    const loginUrl = `${process.env.BIOSTAR_URL}/api/login`;
    console.log('BioStar URL:', loginUrl);
    console.log('Credentials:', { username, password: '***' });
    
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    const response = await axios.post(
      loginUrl,
      {
        User: {
          login_id: username,
          password: password
        }
      },
      {
        timeout: 10000,
        httpsAgent: httpsAgent
      }
    );

    console.log('BioStar response status:', response.status);
    if (response.status === 200) {
      next();
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid BioStar credentials'
      });
    }
  } catch (error) {
    console.error('BioStar auth error:', error.message);
    console.error('Error details:', error.response?.data || error.code);
    return res.status(401).json({
      status: 'error',
      message: `BioStar authentication failed: ${error.message}`
    });
  }
};

module.exports = { authenticate };