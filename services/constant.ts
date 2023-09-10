import { LAST_MAN_STANDING_ABI } from './abi/last_man_standing'
import { WHITELIST_ABI } from './abi/whitelist'

const isDevelopment = process.env.NODE_ENV === 'development'

export const LAST_MAN_STANDING_ADDRESS = '0x2797C0C90E01E96ac119961A59578554e1DD10Bf' as const

export const WHITELIST_DEV_ADDRESS = '0x68EEf6bb643efa224E804a8D604e511d1F8fa032' as const
export const WHITELIST_PROD_ADDRESS = '0xe13B936ca56C4d4Db6DE8e2e0a35a76ea3b5aff1' as const

export const defaultContractObj = {
  address: LAST_MAN_STANDING_ADDRESS,
  abi: LAST_MAN_STANDING_ABI,
}

export const whitelistContractObj = {
  address: isDevelopment ? WHITELIST_DEV_ADDRESS : WHITELIST_PROD_ADDRESS,
  abi: WHITELIST_ABI,
}
