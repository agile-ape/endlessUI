import { LAST_MAN_STANDING_ABI } from './abi/last_man_standing'
import { WHITELIST_ABI } from './abi/whitelist'

const isDevelopment = process.env.NODE_ENV === 'development'

export const LAST_MAN_STANDING_ADDRESS = '0x7DA1cF39B1d7f403416eA7c78660BB050622759F' as const

export const WHITELIST_DEV_ADDRESS = '0x68EEf6bb643efa224E804a8D604e511d1F8fa032' as const
export const WHITELIST_PROD_ADDRESS = '0xe3E6133c3930C265757a6429Ab5e53F30c19D70e' as const

export const defaultContractObj = {
  address: LAST_MAN_STANDING_ADDRESS,
  abi: LAST_MAN_STANDING_ABI,
}

// token contract object - need to update contract
// export const tokenContractObj = {
//   address: LAST_MAN_STANDING_ADDRESS,
//   abi: LAST_MAN_STANDING_ABI,
// }

export const whitelistContractObj = {
  address: isDevelopment ? WHITELIST_DEV_ADDRESS : WHITELIST_PROD_ADDRESS,
  abi: WHITELIST_ABI,
}

export const DOCS_URL = 'https://lastman-n4p5h.notaku.site'
export const DOCS_URL_buy = 'https://lastman-n4p5h.notaku.site/more-info/more-on-start'
export const DOCS_URL_exit =
  'https://lastman-n4p5h.notaku.site/more-info/more-on-submit#7a1575b9c3ef4632a8336be33faa90e9'
export const DOCS_URL_submit = 'https://lastman-n4p5h.notaku.site/more-info/more-on-submit'
export const DOCS_URL_safehouse = 'https://lastman-n4p5h.notaku.site/more-info/more-on-safehouse'
export const DOCS_URL_attack = 'https://lastman-n4p5h.notaku.site/more-info/more-on-attack'
export const DOCS_URL_checkout =
  'https://lastman-n4p5h.notaku.site/more-info/more-on-safehouse#eb59b65bb02845e894fdc55400c7d6ab'
export const DOCS_URL_kickout =
  'https://lastman-n4p5h.notaku.site/more-info/more-on-safehouse#93cd2d661c9b4bd8b42daacbce9ce24c'
export const DOCS_URL_split =
  'https://lastman-n4p5h.notaku.site/more-info/more-on-stages#cb029b4005c94699b1d7eb8856321ea6'

export const TWITTER_URL = 'https://twitter.com/lastman0x'
export const TELEGRAM_URL = 'https://twitter.com/lastman0x'
