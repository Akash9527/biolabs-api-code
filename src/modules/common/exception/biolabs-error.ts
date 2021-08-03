import { BaseError } from "./base-error";

class BiolabsException extends BaseError {  
    constructor (message) {
      super(message)
  
      // assign the error class name in your custom error
      this.name = this.constructor.name
  
      // capturing the stack trace keeps the reference to your error class
      Error.captureStackTrace(this, this.constructor);
  
    }
  }
  
/* istanbul ignore next */
  class ResourceNotFoundException extends BaseError {
    constructor(resource, query) {
      super(`Resource ${resource} was not found.`+query);
      
    }
  }
/* istanbul ignore next */
  class APIException extends BaseError {  
    constructor(name: string, httpCode: string, message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
      
        this.name = name;
     
        Error.captureStackTrace(this);
      }
  }
  
  class InternalException extends BaseError {
    constructor(error) {
      super(error.message);
      
    }
  }

  export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
   }
/* istanbul ignore next */
  class HttpException extends BaseError {
    
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    
    constructor(name: string, httpCode: HttpStatusCode, message: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
    
      this.name = name;
      this.httpCode = httpCode;
    
      Error.captureStackTrace(this);
    }

  }
  

  module.exports = {
    ResourceNotFoundException,
    InternalException,
    APIException,
    BiolabsException,
    HttpException
  };
  