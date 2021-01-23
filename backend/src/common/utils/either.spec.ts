import { either } from './either';

describe('Either', () => {
  describe('isError', () => {
    it('should be truthy if error is present', () => {
      const error = either.error('');

      expect(error.isError()).toBeTruthy();
    });

    it('should be falsy if result is not present', () => {
      const result = either.of('');

      expect(result.isError()).toBeFalsy();
    });
  });

  describe('isResult', () => {
    it('should be truthy if result is present', () => {
      const result = either.of('');

      expect(result.isResult()).toBeTruthy();
    });
    it('should be falsy if result is not present', () => {
      const error = either.error('');

      expect(error.isResult()).toBeFalsy();
    });
  });

  describe('value', () => {
    it('should return correct value', () => {
      const value = 'value';
      const result = either.of(value);

      expect(result.value).toBe(value);
    });
  });

  describe('errorsIfPresent', () => {
    it('should return errors', () => {
      const value = 'value';
      const error = either.error(value);

      expect(error.errorsIfPresent()).toBe(value);
    });
    it('should return undefined if result is not present', () => {
      const value = 'value';
      const result = either.of(value);

      expect(result.errorsIfPresent()).toBeFalsy();
    });
  });
  describe('resultIfPresent', () => {
    it('should return result if result is present', () => {
      const value = 'value';
      const result = either.of(value);

      expect(result.resultIfPresent()).toBe(value);
    });
    it('should return undefined if result is not present', () => {
      const value = 'value';
      const error = either.error(value);

      expect(error.resultIfPresent()).toBeFalsy();
    });
  });
});

describe('either', () => {
  describe('of', () => {
    it('should initialise Either with result', () => {
      const value = 'value';
      const result = either.of(value);

      expect(result.resultIfPresent()).toBe(value);
    });
  });
  describe('error', () => {
    it('should initialise Either with error', () => {
      const value = 'value';
      const result = either.error(value);

      expect(result.errorsIfPresent()).toBe(value);
    });
  });
});
