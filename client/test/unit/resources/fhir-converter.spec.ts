import {FhirResourceValueConverter} from '../../../src/resources/fhir-resource-value-converter';
import {FHIR_Resource} from '../../../../common/models/fhir';

describe('FhirResource Value Converter', () => {
  let cnv = new FhirResourceValueConverter();
  let testee:FHIR_Resource = {
    'resourceType': 'UnitTest',
    'id': '007',
    'foo': 'bar',
    'baz': {
      'lame': 'duck',
      'empty': {
        'space': 'wow'
      },
      'array': [
        'one',
        'two',
        {'three': 3}
      ]
    }
  };

  describe('fhir reader', () => {
    it('returns string values for fhir properties', (done) => {
      console.log('fhir reader');

      expect(cnv.toView("", 'foo', testee)).toBe('bar');
      expect(cnv.toView("", 'baz.lame', testee)).toBe('duck');
      expect(cnv.toView("", 'baz.empty.space', testee)).toBe('wow');
      expect(cnv.toView("", 'baz.empty.spac', testee)).toBe('');
      expect(cnv.toView("", 'baz.array[0]', testee)).toBe('one');
      expect(cnv.toView("", 'baz.array[2].three', testee)).toBe(3);
      done();
    });
  });

  describe('fhir writer', () => {
    it('writes fhir properties from string values', (done) => {
      console.log('fhir writer')
      cnv.fromView("buzz", 'foo', testee)
      expect(testee['foo']).toBe("buzz")
      cnv.fromView('ork', 'baz.lame', testee)
      expect(testee.baz.lame).toBe("ork")
      cnv.fromView('harr', 'baz.empty.space', testee)
      expect(testee.baz.empty.space).toBe("harr")
      cnv.fromView('huch','baz.empty.spac',testee)
      expect(testee.baz.empty.spac).toBe("huch")
      cnv.fromView('what','baz.array[1]',testee)
      expect(testee.baz.array[1]).toBe('what')
      cnv.fromView('uh','baz.array[2].three',testee)
      expect(testee.baz.array[2].three).toBe("uh")
      done()
    });
  })
});