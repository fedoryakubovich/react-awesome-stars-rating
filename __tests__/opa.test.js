import React from 'react';
import { shallow } from 'enzyme';

import ReactStarsRating from '../src';

it('Render ReactStarsRating', () => {
  shallow(<ReactStarsRating />);
});

describe('Count stars', () => {
  it('Count stars is equal 5', () => {
    const countStars = 5;

    const wrapper = shallow(<ReactStarsRating count={countStars} />);
    expect(wrapper.find('.star')).toHaveLength(countStars);
  });

  it('Count stars is equal 10', () => {
    const countStars = 10;

    const wrapper = shallow(<ReactStarsRating count={countStars} />);
    expect(wrapper.find('.star')).toHaveLength(countStars);
  });
});
