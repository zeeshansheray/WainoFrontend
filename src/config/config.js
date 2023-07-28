import { Environment } from '../enums/enums'

const env = {
    API_URL : 'http://localhost:8080',
    GOOGLE_CLIENT_ID : '',
    IMAGE_BASE_URL : ''
}

if(process.env.REACT_APP_ENV === Environment.DEVELOPMENT){
    env.API_URL            = 'http://localhost:8080'
}

if(process.env.REACT_APP_ENV === Environment.PRODUCTION){
    env.API_URL            = 'http://3.71.83.123/api'
}



export default env