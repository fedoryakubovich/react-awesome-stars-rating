import React from 'react';

import ReactStarsExample from './ReactStarsExample';
import ReduxFormExample from './ReduxFormExample';
import ReactHookFormExample from './ReactHookFormExample';

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

      <section>
        <h3>Redux Hook Form</h3>
        <ReactHookFormExample />
      </section>
    </section>
  );
};

export default Examples;
