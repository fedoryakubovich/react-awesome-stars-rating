# React Stars Rating

React Stars Rating is a simple star component with easy integration for your React applications.

- Half stars
- Custom size and color
- Value shows with high precision
- Easy integration with Redux

## Table of Contents

- [Installation](#installation)
- [Examples](#examples)
- [Documentation](#documentation)

## Installation

`npm install react-stars-rating`

## Example

```
import React from 'react';
import ReactDOM from 'react-dom';
import ReactStarsRating from 'react-stars-rating';

const onChange = (value) => {
  console.log(`React Stars Rating value is ${value}`);
};

const ReactStarsExample = ({ value }) => {
  return <ReactStarsRating onChange={onChange} value={value} />;
};

ReactDOM.render(<ReactStarsExample />, document.getElementById('root'));
```

## Documentation

| Name     | Description                                              | Type     | Default |
| :------- | :------------------------------------------------------- | :------- | :------ |
| value    | Value                                                    | Number   | 0       |
| onChange | A function, that will be invoked when value have changed | Function | null    |
