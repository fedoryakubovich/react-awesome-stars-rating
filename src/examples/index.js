import React from 'react';

import ReactStarsExample from './ReactStarsExample';
import ReduxFormExample from './ReduxFormExample';

const Examples = () => {
  return (
    <section>
      <section>
        <h3>Simple Example</h3>
        <ReactStarsExample />
      </section>
      <section>
        <h3>Redux Form</h3>
        <ReduxFormExample />
      </section>
    </section>
  );
};

export default Examples;
