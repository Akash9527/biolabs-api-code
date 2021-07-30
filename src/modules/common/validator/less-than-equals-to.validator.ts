import { registerDecorator, ValidationOptions } from 'class-validator';
/* istanbul ignore next */
export function LessThanEqualsTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'LessThanEqualsTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: any) {
          const [relatedPropertyName] = args.constraints;
          return Number(args.object[relatedPropertyName]) >= Number(value);
        },
        defaultMessage() {
          return '$property must be less than equals to $constraint1';
        },
      },
    });
  };
}