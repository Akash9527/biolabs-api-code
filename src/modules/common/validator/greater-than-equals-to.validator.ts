import { registerDecorator, ValidationOptions } from 'class-validator';
/* istanbul ignore next */
export function GreaterThanEqualsTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'GreaterThanEqualsTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: any) {
          const [relatedPropertyName] = args.constraints;
          return Number(args.object[relatedPropertyName]) <= Number(value);
        },
        defaultMessage() {
          return '$property must be greater than equals to $constraint1';
        },
      },
    });
  };
}