import { render, screen } from '@testing-library/react';

import { ConsortiumManager } from './ConsortiumManager';

const defaultProps = {};

const renderConsortiumManager = (props = {}) => render(
  <ConsortiumManager
    {...defaultProps}
    {...props}
  />,
);

describe('ConsortiumManager', () => {
  it('should render ConsortiumManager', () => {
    renderConsortiumManager();

    expect(screen.getByText('Consortium Manager')).toBeInTheDocument();
  });
});
