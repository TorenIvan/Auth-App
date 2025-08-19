import axios from 'axios';
import { EnvironmentVariables } from '../../constants/EnvironmentVariables';
import { retrieveSocialProfileToken } from './retrieveSocialProfileToken';
import { logger } from '../general/logger';

async function verifySocialProfileToken(
  cookies: {
    [cookieName: string]: string | undefined;
  },
  signInMethod: SignInMethod
): Promise<void> {
  if (signInMethod === 'credentials') return;

  const socialProfileToken = retrieveSocialProfileToken(cookies) ?? '';
  if (!socialProfileToken) {
    logger.debug('Token not exist for social profile. Unauthorized');
    throw new Error('Token not exist for social profile. Unauthorized');
  }

  switch (signInMethod) {
    case 'facebook': {
      const tokenVerifyInfo = await axios.get(
        `https://graph.facebook.com/debug_token?input_token=${socialProfileToken}&access_token=${socialProfileToken}`,
        { headers: { Origin: EnvironmentVariables.ServerUri } }
      );

      if (!tokenVerifyInfo?.data?.data?.is_valid) {
        throw new Error('Token is invalid. Unauthorized');
      }

      if (tokenVerifyInfo.data.data.app_id !== EnvironmentVariables.Facebook_App_Id) {
        throw new Error('Token has invalid app_id. Unauthorized');
      }
      break;
    }
    case 'github': {
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${socialProfileToken}` },
      });
      if (userResponse.status < 200 || userResponse.status >= 300) {
        logger.debug('Token is invalid. Unauthorized');
        throw new Error('Token is invalid. Unauthorized');
      }
      break;
    }
    case 'twitter':
    case 'google':
    default: {
      throw new Error('No known sign-in method found. Unauthorized');
    }
  }
}

export { verifySocialProfileToken };
