enum EitherType {
  ERROR,
  RESULT,
}

type EitherOf<T, U> = [U] extends [never] ? T : U;

export interface Either<T, U> {
  isError(): this is Either<T, never>;

  isResult(): this is Either<never, U>;

  value: EitherOf<T, U>;

  errorsIfPresent(): T | undefined;

  resultIfPresent(): U | undefined;
}

export class EitherWrapper<T, U> implements Either<T, U> {
  private readonly _value: EitherOf<T, U>;
  private readonly _type: EitherType;

  constructor(value, type) {
    this._value = value;
    this._type = type;
  }

  isError(): boolean {
    return this._type === EitherType.ERROR;
  }

  isResult(): boolean {
    return this._type === EitherType.RESULT;
  }

  get value(): EitherOf<T, U> {
    return this._value;
  }

  errorsIfPresent(): T | undefined {
    if (this.isError()) {
      return (this._value as unknown) as T;
    }
  }

  resultIfPresent(): U | undefined {
    if (this.isResult()) {
      return (this._value as unknown) as U;
    }
  }
}

const of = <U>(result: U): Either<never, U> => {
  return new EitherWrapper<never, U>(result, EitherType.RESULT);
};

const error = <T>(error: T): Either<T, never> => {
  return new EitherWrapper<T, never>(error, EitherType.ERROR);
};

export const either = { of, error };
