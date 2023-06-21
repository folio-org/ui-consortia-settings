import { render, within } from '@folio/jest-config-stripes/testing-library/react';

import { affiliations } from 'fixtures/affiliations';
import { AffiliationSelection } from './AffiliationSelection';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');

const defaultProps = {
  id: 'test',
  affiliations,
  value: affiliations[2].tenantId,
  onChange: jest.fn(),
  isLoading: false,
};

const renderAffiliationSelection = (props = {}) => render(
  <AffiliationSelection
    {...defaultProps}
    {...props}
  />,
);

describe('AffiliationSelection', () => {
  it('should render affiliation select with provided options', () => {
    renderAffiliationSelection();

    expect(
      within(document.getElementById('test-affiliations-select'))
        .getByText(affiliations[2].tenantName),
    ).toBeInTheDocument();
    affiliations.forEach(({ tenantName, isPrimary }) => {
      expect(
        within(document.getElementById('sl-test-affiliations-select'))
          .getByText(isPrimary ? `${tenantName} ui-users.affiliations.primary.label` : tenantName),
      ).toBeInTheDocument();
    });
  });
});
