import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import { EVENT_EMITTER_EVENTS } from '../../constants';
import { useEventEmitter } from '../../hooks';
import { AffiliationLookupSuppressor } from './AffiliationLookupSuppressor';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useEventEmitter: jest.fn(),
}));

const renderAffiliationLookupSuppressor = (props = {}) => render(
  <AffiliationLookupSuppressor {...props} />,
  { wrapper: MemoryRouter },
);

const emitterMock = {
  emit: jest.fn(),
};

describe('AffiliationLookupSuppressor', () => {
  beforeEach(() => {
    emitterMock.emit.mockClear();
    useEventEmitter
      .mockClear()
      .mockReturnValue(emitterMock);
  });

  it('should emit the event to disable member selection lookup trigger', () => {
    renderAffiliationLookupSuppressor();

    expect(emitterMock.emit).toHaveBeenCalledWith(EVENT_EMITTER_EVENTS.DISABLE_SELECT_MEMBERS, true);
  });
});
