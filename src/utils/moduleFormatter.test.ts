import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatModuleRuleItems, extractInlineSubClauses } from './moduleFormatter';

describe('Smart Module Rule Formatter', () => {
  it('never numbers definitions and classifies them as unnumbered definition blocks', () => {
    const items = [
      'Definition: Work exceeding eight (8) hours within the worker’s 24-hour workday.',
      'Working Conditions Definition: The terms and circumstances affecting the employment of an employee.',
      'Premium Pay Definition: Additional compensation required by law for work performed within eight (8) hours on non-working days.',
      'Child Definition: Any person under eighteen (18) years of age.',
    ];

    const formatted = formatModuleRuleItems(items);
    assert.equal(formatted.length, 4);
    for (const item of formatted) {
      assert.equal(item.kind, 'definition');
      assert.equal(item.number, undefined);
      assert.equal(item.badgeLabel, 'DEFINITION');
    }
    assert.equal(formatted[0].title, 'Statutory Definition');
    assert.equal(formatted[1].title, 'Working Conditions');
    assert.equal(formatted[3].title, 'Child');
  });

  it('preserves exact numbering after group headers without shifting item numbers', () => {
    const items = [
      'Core Doctrine: Persons who work with substantially equal qualifications should be paid similar salaries.',
      '5 Exclusions from Equal Work for Equal Pay:',
      '1. Farm tenancy or leasehold.',
      '2. Household or domestic helpers.',
      'Note on BMBE: Workers in registered BMBEs are exempt ONLY from the Minimum Wage Law.',
    ];

    const formatted = formatModuleRuleItems(items);
    assert.equal(formatted[0].kind, 'callout');
    assert.equal(formatted[0].number, undefined);

    assert.equal(formatted[1].kind, 'group_header');
    assert.equal(formatted[1].number, undefined);
    assert.equal(formatted[1].body, '5 Exclusions from Equal Work for Equal Pay');

    assert.equal(formatted[2].kind, 'numbered');
    assert.equal(formatted[2].number, 1);

    assert.equal(formatted[3].kind, 'numbered');
    assert.equal(formatted[3].number, 2);

    assert.equal(formatted[4].kind, 'callout');
    assert.equal(formatted[4].tone, 'note');
    assert.equal(formatted[4].number, undefined);
  });

  it('decomposes inline (1)/(2) and (a)/(b) sub-clauses cleanly', () => {
    const raw =
      'Lectures/Meetings/Trainings are NOT counted as working time if ALL 3 conditions are met: (a) Attendance is outside regular working hours; (b) Attendance is in fact voluntary; AND (c) The employee does not perform any productive work during attendance.';

    const parsed = extractInlineSubClauses(raw);
    assert.ok(parsed);
    assert.equal(parsed.subClauses.length, 3);
    assert.equal(parsed.subClauses[0].marker, 'a');
    assert.equal(parsed.subClauses[2].marker, 'c');
  });
});
