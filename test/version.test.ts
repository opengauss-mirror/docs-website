import { describe, it, expect } from 'vitest';
import './setup';
import { extractVersionKey, parseEolTime } from '../app/.vitepress/src/utils/version';

describe('version', () => {
  describe('extractVersionKey', () => {
    it('should strip the suffix in parentheses', () => {
      expect(extractVersionKey('7.0.0 (LTS)')).toBe('7.0.0');
      expect(extractVersionKey('5.1.0 (Preview)')).toBe('5.1.0');
    });

    it('should return the version name when it has no suffix', () => {
      expect(extractVersionKey('7.0.0-RC3')).toBe('7.0.0-RC3');
    });

    it('should trim spaces and collapse multiple separators', () => {
      expect(extractVersionKey('  6.0.6    (LTS)  ')).toBe('6.0.6');
    });

    it('should return empty string for empty input', () => {
      expect(extractVersionKey('')).toBe('');
    });
  });

  describe('parseEolTime', () => {
    it('should parse YYYY.MM.DD format', () => {
      expect(parseEolTime('2027.09.30')).toBe(new Date(2027, 8, 30).getTime());
    });

    it('should parse single digit month and day', () => {
      expect(parseEolTime('2026.3.5')).toBe(new Date(2026, 2, 5).getTime());
    });

    it('should parse YYYY.MM format as the first day of the month', () => {
      expect(parseEolTime('2024.03')).toBe(new Date(2024, 2, 1).getTime());
    });

    it('should return NaN for empty value', () => {
      expect(parseEolTime('')).toBeNaN();
    });

    it('should return NaN for unsupported formats', () => {
      expect(parseEolTime('2027/09/30')).toBeNaN();
      expect(parseEolTime('2027-09-30')).toBeNaN();
      expect(parseEolTime('2027.09.30.01')).toBeNaN();
      expect(parseEolTime('27.09.30')).toBeNaN();
      expect(parseEolTime('unknown')).toBeNaN();
    });
  });
});
