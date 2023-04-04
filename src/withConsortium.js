import React from 'react';

import { ConsortiumContext } from './ConsortiumContext';

export const withConsortium = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <ConsortiumContext.Consumer>
          {(consortium) => (
            <WrappedComponent
              consortium={consortium}
              {...this.props}
            />
          )}
        </ConsortiumContext.Consumer>
      );
    }
  };
};
