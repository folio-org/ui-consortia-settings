import { render, within, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
  it('should render affiliation select with provided options', async () => {
    renderAffiliationSelection();

    expect(
      within(screen.getByRole('button', { name: /Mineral Area College/ }))
        .getByText(affiliations[2].tenantName),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Mineral Area College/ }));

    affiliations.forEach(({ tenantName, isPrimary }) => {
      screen.getAllByText(isPrimary ? `${tenantName} ui-users.affiliations.primary.label` : tenantName).forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });
});
