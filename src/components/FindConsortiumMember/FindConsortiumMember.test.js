import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { tenants } from 'fixtures';
import { FindConsortiumMember } from './FindConsortiumMember';

const defaultProps = {
  onClose: jest.fn(),
  selectRecords: jest.fn(),
  records: tenants,
  initialSelected: [tenants[3]],
};

const renderFindConsortiumMember = (props = {}) => render(
  <FindConsortiumMember
    {...defaultProps}
    {...props}
  />,
);

describe('FindConsortiumMember', () => {
  it('should render custom trigger', () => {
    const triggerLabel = 'Custom name';

    renderFindConsortiumMember({
      renderTrigger: () => triggerLabel,
    });

    expect(screen.getByText(triggerLabel)).toBeInTheDocument();
  });

  describe('Modal', () => {
    beforeEach(async () => {
      renderFindConsortiumMember();
      await userEvent.click(await screen.findByRole('button', { name: 'ui-consortia-settings.consortiumManager.findMember.trigger.label' }));
    });

    it('should render find record modal', async () => {
      expect(await screen.findByText('ui-consortia-settings.consortiumManager.findMember.modal.title')).toBeInTheDocument();
    });

    it('should close modal when \'Cancel\' button was clicked', async () => {
      await userEvent.click(await screen.findByText('stripes-core.button.cancel'));

      expect(screen.queryByText('ui-consortia-settings.consortiumManager.findMember.modal.title')).not.toBeInTheDocument();
    });

    it('should handle selected records when \'Save & close\' button was clicked', async () => {
      await userEvent.click(await screen.findByText('stripes-components.saveAndClose'));

      expect(defaultProps.selectRecords).toHaveBeenCalled();
    });

    describe('Filters', () => {
      it('should filter results by search query', async () => {
        expect(await screen.findAllByRole('row', { hidden: true })).toHaveLength(tenants.length + 1);

        await userEvent.type(await screen.findByLabelText('ui-consortia-settings.consortiumManager.findMember.modal.aria.search'), tenants[0].name);
        await userEvent.click(await screen.findByText('stripes-acq-components.search'));

        expect(await screen.findAllByRole('row', { hidden: true })).toHaveLength(2);
      });

      it('should reset filters when \'Reset all\' button was clicked', async () => {
        await userEvent.type(await screen.findByLabelText('ui-consortia-settings.consortiumManager.findMember.modal.aria.search'), 'Community');
        await userEvent.click(await screen.findByText('stripes-acq-components.search'));

        expect(await screen.findAllByRole('row', { hidden: true })).toHaveLength(3);

        await userEvent.click(await screen.findByTestId('reset-button'));

        expect(await screen.findAllByRole('row', { hidden: true })).toHaveLength(tenants.length + 1);
      });
    });
  });
});
