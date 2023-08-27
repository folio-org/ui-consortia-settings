import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import ItemFormatter from './ItemFormatter';

describe('ItemFormatter', () => {
  it('should render component', () => {
    render(<ItemFormatter item="test" uniqueItems={[]} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should render mark element for unique elements', () => {
    const { container } = render(<ItemFormatter item="test" uniqueItems={['test']} />);
    const markedElement = container.querySelectorAll('li > mark');

    expect(markedElement.length).toBe(1);
  });
});
