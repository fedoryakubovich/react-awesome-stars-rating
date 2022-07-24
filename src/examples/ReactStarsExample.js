import React from 'react';

import ReactStarsRating from '../lib';

const ReactStarsExample = () => {
  const [state, setState] = React.useState({ value: 3.2, isEdit: true });

  const onChange = (value) => {
    setState({ value, isEdit: false, selectedValue: value });
  };

  return (
    <section>
      <ReactStarsRating
        onChange={onChange}
        isEdit={state.isEdit}
        value={state.value}
        isHalf
        selectedValue={state.selectedValue}
        id="simple"
      />

      <div>Selected value: {state.selectedValue}</div>
    </section>
  );
};

export default ReactStarsExample;
