import { issuesAdapter, issuesSelectors } from '../entity-adapters';

describe('entity adapters', () => {
  describe('issues adapter', () => {
    it('creates an entity adapter for issues', () => {
      expect(issuesAdapter).toMatchSnapshot();
    });

    it('returns generated selector for the issues adapter', () => {
      expect(issuesSelectors).toMatchSnapshot();
    });
  });
});
