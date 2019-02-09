import React from 'react';
import { shallow, mount } from 'enzyme';

import ReactStarsRating from '../src';

describe('Render', () => {
  it('ReactStarsRating', () => {
    shallow(<ReactStarsRating />);
  });
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

describe('onChange simulate', () => {
  describe('isEdit is equal true', () => {
    it('without isHalf', () => {
      const props = {
        countStars: 5,
        isHalf: false,
        onChange: jest.fn(),
      };

      const wrapper = mount(<ReactStarsRating {...props} />);
      wrapper.find('.star-3 svg').simulate('click');
      expect(props.onChange).toBeCalledWith(3);
    });

    it('with isHalf', () => {
      const props = {
        countStars: 5,
        isHalf: true,
        onChange: jest.fn(),
      };

      const wrapper = mount(<ReactStarsRating {...props} />);
      wrapper.find('.star-3 svg').simulate('click');
      expect(props.onChange).toBeCalledWith(2.5);
    });

    it('onMouseOver', () => {
      const props = {
        countStars: 5,
        isHalf: false,
        onChange: jest.fn(),
      };

      const wrapper = mount(<ReactStarsRating {...props} />);
      wrapper.find('.star-3 svg').simulate('mousemove');
      expect(wrapper.state('value')).toEqual(3);
    });

    it('onMouseOver', () => {
      const props = {
        countStars: 5,
        isHalf: true,
        onChange: jest.fn(),
      };

      const wrapper = mount(<ReactStarsRating {...props} />);
      wrapper.find('.star-3 svg').simulate('mousemove');
      expect(wrapper.state('value')).toEqual(2.5);
    });
  });

  describe('isEdit is equal false', () => {
    it('without isHalf', () => {
      const props = {
        countStars: 5,
        isHalf: false,
        isEdit: false,
        onChange: jest.fn(),
      };

      const wrapper = mount(<ReactStarsRating {...props} />);
      wrapper.find('.star-3 svg').simulate('click');
      expect(props.onChange).not.toBeCalled();
    });
  });
});

// props checking
