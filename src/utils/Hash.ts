import * as bcrypt from 'bcrypt';
const {info} = require('./logger');

export class Hash {

  /**
   * Description: This method will encrypt the given string.
   * @description This method will encrypt the given string.
   */
  static make(plainText) {
    info("encrypt the given string ",__filename,"make()");
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(plainText, salt);
  }

  /**
   * Description: This method will compare the encrypted string and the plain string.
   * @description This method will compare the encrypted string and the plain string.
   */
  static compare(plainText, hash) {
    info("compare the encrypted string and the plain string ",__filename,"compare()");
    return bcrypt.compareSync(plainText, hash);
  }
}