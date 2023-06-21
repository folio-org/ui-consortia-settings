import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router-dom';

import { CalloutContext } from '@folio/stripes/core';

let rtlApi;

const history = createMemoryHistory();

export const renderWithRouter = (children, options = {}) => {
  const renderFn = options.rerender ? rtlApi.rerender : render;

  rtlApi = renderFn(
    <Router history={history}>
      <CalloutContext.Provider value={{ sendCallout: () => { } }}>
        <IntlProvider
          locale="en"
          messages={{}}
        >
          {children}
        </IntlProvider>
      </CalloutContext.Provider>
    </Router>,
  );

  return rtlApi;
};
