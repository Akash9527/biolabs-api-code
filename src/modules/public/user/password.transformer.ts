import { ValueTransformer } from 'typeorm';
import { Hash } from '../../../utils/Hash';

export class PasswordTransformer implements ValueTransformer {
  to(value) {
    if (value && value != "")
      return Hash.make(value);
    else
      return value
  }

  from(value) {
    return value;
  }
}
