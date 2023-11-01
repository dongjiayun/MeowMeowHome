export const Phone = '^(1[3-9])[0-9]{9}$'
export const Telephone = '^0\\d{2,3}-?\\d{7,8}$'
export const MobileAndTelephone = '^((1[3-9])[0-9]{9})|(0\d{2,3}-?\\d{7,8})$'
export const Email = '^\\w+@[a-zA-Z0-9]{2,10}(?:\\.[a-z]{2,4}){1,3}$'
export const Identity = '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$'
export const ChineseEnglishAndNumber = '^[\\u4e00-\\u9fa5_a-zA-Z0-9\\s]*$'
export const Price = '^([0-9]{0,9})(\\.\\d{1,2})?$' // 请输入0~9999999999.99的数字
export const PriceBiggerThanZero = '^([1-9]\\d{0,8}(\\.\\d{1,2})?|([0](\\.([0][1-9]|[1-9]\\d{0,1}))))$' // 请输入0.01~9999999999.99的数字

// 百分比校验，最多两位小数， 包含100.0、100.00、等
export const PercentRate = '(^100$)|(^100\\.0$)|(^100\\.00$)|(^\\d{1,2}(\\.\\d{1,2})?$)'

