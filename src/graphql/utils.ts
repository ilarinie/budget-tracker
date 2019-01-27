import { ValidationError } from 'class-validator';

export const mapValidationErrorsToErrorModel = (errors: ValidationError[], object: Object) => {
  const ErrorModel = {};
  errors.forEach(e => {
    if (object.hasOwnProperty(e.property)) {
      const errorMessages: string[] = [];
      Object.keys(e.constraints as Object).forEach(c => {
        errorMessages.push(e.constraints[c]);
      });
      ErrorModel[e.property] = errorMessages;
    }
  });
  return ErrorModel;
};