import type { Feature } from './types';
import type { UserProfileAPIConfig } from 'types/client/userProfileAPIConfig';

import { getEnvValue, parseEnvJson } from '../utils';

const value = parseEnvJson<UserProfileAPIConfig>(getEnvValue('NEXT_PUBLIC_USER_PROFILE_API'));

function checkApiUrlTemplate(apiUrlTemplate: string): boolean {
  try {
    const testUrl = apiUrlTemplate.replace('{address}', '0x0000000000000000000000000000000000000000');
    new URL(testUrl).toString();
    return true;
  } catch (error) {
    return false;
  }
}

const title = 'User profile API';

const config: Feature<{
  apiUrlTemplate: string;
  tagLinkTemplate?: string;
  tagIcon?: string;
  tagBgColor?: string;
  tagTextColor?: string;
}> = (() => {
  if (value && checkApiUrlTemplate(value.api_url_template)) {
    return Object.freeze({
      title,
      isEnabled: true,
      apiUrlTemplate: value.api_url_template,
      tagLinkTemplate: value.tag_link_template,
      tagIcon: value.tag_icon,
      tagBgColor: value.tag_bg_color,
      tagTextColor: value.tag_text_color,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
