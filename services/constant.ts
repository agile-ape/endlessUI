import { LAST_MAN_STANDING_ABI } from './abi/last_man_standing'
import { WHITELIST_ABI } from './abi/whitelist'

const isDevelopment = process.env.NODE_ENV === 'development'

export const LAST_MAN_STANDING_ADDRESS = '0x26d8fea822bb4cc41fb6b98051d8fb7ebd11ffd2' as const

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
