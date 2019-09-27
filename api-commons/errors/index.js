'use strict'

class LogicError extends Error {
  constructor(message) {
      super(message)
      this.name = 'LogicError'
      this.message = message
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
      super(message)
      this.name = 'UnauthorizedError'
      this.message = message
  }
}

class UnknownError extends Error {
  constructor(message) {
      super(message)
      this.name = 'UnknownError'
      this.message = message
  }
}

class ValidationError extends Error {
  constructor(message) {
      super(message)
      this.name = 'ValidationError'
      this.message = message
  }
}

class HttpError extends Error {
  constructor(message) {
      super(message)
      this.name = 'HttpError'
      this.message = message
  }
}


module.exports = {
  LogicError,
  UnauthorizedError,
  UnknownError,
  ValidationError,
  HttpError
}