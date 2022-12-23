export const RULE_VALIDATE = {
  mostOnePoint(rule, value, callback) {
    if (!/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) {
      callback(new Error('最多一位小数！！！'));
    } else {
      callback();
    }
  },
  validateIP(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的IP地址'));
      } else {
        callback();
      }
    }
  },
  validateMobileOrTel(rule, value, callback) {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
    ;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的电话号码或者固话号码'));
      } else {
        callback();
      }
    }
  },
  validateMobile(rule, value, callback) {
    const reg = /^[1][0-9]{10}$/;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的电话号码'));
      } else {
        callback();
      }
    }
  },
  validateTelPhone(rule, value, callback) {
    const reg = /0\d{2,3}-\d{7,8}/;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的固定电话）'));
      } else {
        callback();
      }
    }
  },
  validateIdNo(rule, value, callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的身份证号码'));
      } else {
        callback();
      }
    }
  }, validateEMail(rule, value, callback) {
    const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    }
  }, validateURL(url) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(url);
  },
  isPassword(rule, value, callback) {
    const reg = /^[_a-zA-Z0-9]+$/;
    if (value == '' || value == undefined || value == null) {
      callback();
    } else {
      if (!reg.test(value)) {
        callback(new Error('仅由英文字母，数字以及下划线组成'));
      } else {
        callback();
      }
    }
  }, checkMax20000(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback();
    } else if (!Number(value)) {
      callback(new Error('请输入[1,20000]之间的数字'));
    } else if (value < 1 || value > 20000) {
      callback(new Error('请输入[1,20000]之间的数字'));
    } else {
      callback();
    }
  },
  isInteger(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数'));
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      }
    }, 0);
  }, isIntegerNotMust(rule, value, callback) {
    if (!value) {
      callback();
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入正整数'));
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      }
    }, 1000);
  }, isDecimal(rule, value, callback) {
    if (!value) {
      return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error('请输入[0,1]之间的数字'));
      } else {
        if (value < 0 || value > 1) {
          callback(new Error('请输入[0,1]之间的数字'));
        } else {
          callback();
        }
      }
    }, 100);
  },
  isAccount(rule, value, callback) {
    if (!value) {
      return callback(new Error('请输入账号'))
    }
    if (!/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{3,20}$/.test(value)) {
      callback(new Error('账号必须为3-20位字母和数字组合'))
    } else {
      callback()
    }
  },
  isEngAccount(rule, value, callback) {
    if (!value) {
      return callback(new Error('请输入账号'))
    }
    if (!/^[a-zA-Z0-9]{3,20}$/.test(value)) {
      callback(new Error('账号必须为3-20位字母或数字'))
    } else {
      callback()
    }
  }
}
export const validateNumber = (rule, value, callback) => {
  let numberReg = /^\d+$|^\d+[.]?\d+$/
  if (value !== '') {
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入值'))
  }
}

export const ID = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('身份证不能为空'))
  }
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
    callback(new Error('请输入正确的二代身份证号码'))
  } else {
    callback()
  }
}
/**
 * 判断是否含有
 * @param array
 * @param obj
 * @returns {boolean}
 */
export function isContain(array, obj){
  return array.some(function (cell) {
    return cell+"" === obj.toString()
  });
}
