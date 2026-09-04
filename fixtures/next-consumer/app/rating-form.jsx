'use client';

import { useState } from 'react';
import ReactStarsRating from 'react-awesome-stars-rating';

export default function RatingForm() {
  const [rating, setRating] = useState(3.5);
  return (
    <>
      <ReactStarsRating
        value={rating}
        onChange={setRating}
        ariaLabel="Your rating"
      />
      <output data-testid="rating-value">{rating}</output>
      <button type="button" onClick={() => setRating(0)}>
        Clear rating
      </button>
      <button type="button" onClick={() => setRating(3.5)}>
        Restore initial rating
      </button>
    </>
  );
}
