import * as bcrypt from 'bcrypt';

export class Hash {

  /**
   * Description: This method will encrypt the given string.
   * @description This method will encrypt the given string.
   */
  static make(plainText) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(plainText, salt);
  }

  /**
   * Description: This method will compare the encrypted string and the plain string.
   * @description This method will compare the encrypted string and the plain string.
   */
  static compare(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}