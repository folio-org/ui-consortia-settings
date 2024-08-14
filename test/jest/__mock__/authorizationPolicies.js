import React from 'react';

jest.mock('@folio/authorization-policies', () => {
  return jest.fn(({ children, affiliationSelectionComponent }) => (
    <div>
      {affiliationSelectionComponent}
      {children}
    </div>
  ));
});
