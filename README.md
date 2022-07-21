# React Awesome Stars Rating &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/fedoryakubovich/react-awesome-stars-rating/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-awesome-stars-rating.svg?style=flat)](https://www.npmjs.com/package/react-awesome-stars-rating) [![Build Status](https://www.travis-ci.com/fedoryakubovich/react-awesome-stars-rating.svg?branch=master)](https://www.travis-ci.com/) [![codecov](https://codecov.io/gh/fedoryakubovich/react-awesome-stars-rating/branch/main/graph/badge.svg?token=JPQCSB8NTN)](https://codecov.io/gh/fedoryakubovich/react-awesome-stars-rating)

React Awesome Stars Rating is a simple star component with easy integration for your React applications.

## Table of Contents

- [Previews](#previews)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Documentation](#documentation)

## Previews

![react-awesome-stars-rating preview](https://github.com/fedoryakubovich/react-awesome-stars-rating/blob/master/images/gifs/react-awesome-stars-rating.gif)

## Features

- Half stars
- Custom size and color
- Value shows with high precision
- Easy integration with Redux
- Accessibility
- SVG Icons

## Installation

`npm install react-awesome-stars-rating`

## Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import ReactStarsRating from 'react-awesome-stars-rating';

const onChange = (value) => {
  console.log(`React Stars Rating value is ${value}`);
};

const ReactStarsExample = ({ value }) => {
  return <ReactStarsRating onChange={onChange} value={value} />;
};

ReactDOM.render(<ReactStarsExample />, document.getElementById('root'));
```

## Documentation

| Name           | Description                                              | Type     | Default         |
| :------------- | :------------------------------------------------------- | :------- | :-------------- |
| id             | Identifier                                               | String   | `${Date.now()}` |
| value          | Value                                                    | Number   | 0               |
| onChange       | A function, that will be invoked when value have changed | Function | null            |
| isEdit         | If `true` the rating is in editing mode                  | Boolean  | true            |
| isHalf         | If `true` half stars are available                       | Boolean  | true            |
| count          | Count of the stars                                       | Number   | 5               |
| size           | Size of the stars                                        | Number   | 25              |
| starGap        | Gap between the stars                                    | Number   | 0               |
| className      | Class name for button container                          | String   | ''              |
| primaryColor   | Star's color when star is active                         | String   | 'orange'        |
| secondaryColor | Star's color when star isn't active                      | String   | 'grey'          |
| isArrowSubmit  | Left arrow or right arrow click onvokes onChange         | Boolean  | false           |

## Examples

You can see live examples by below links:

- [Simple Example](https://repl.it/@fedoryakubovich/React-Awesome-Stars-Rating-Simple-Example)
- [Integration](https://repl.it/@fedoryakubovich/React-Awesome-Stars-Rating-Redux-Form-Example) with [redux-form](https://github.com/erikras/redux-form)
