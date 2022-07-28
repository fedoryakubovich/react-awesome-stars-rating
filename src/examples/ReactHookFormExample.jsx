import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import ReactStarsRating from '../lib';

export default function App() {
  const { control } = useForm();

  const [state, setState] = React.useState({ value: 3.2, isEdit: true });

  const onChange = (value) => {
    setState({ value, isEdit: false, selectedValue: value });
  };

  return (
    <form>
      <Controller
        name="reactAwesomeStarsRating"
        control={control}
        render={({ field }) => {
          return (
            <ReactStarsRating
              {...field}
              id="reactHookFormExample"
              value={state.value}
              isEdit={state.isEdit}
              selectedValue={state.selectedValue}
              onChange={(event) => {
                onChange(event);
                field.onChange(event);
              }}
            />
          );
        }}
      />

      <div>Selected value: {state.value}</div>
    </form>
  );
}
