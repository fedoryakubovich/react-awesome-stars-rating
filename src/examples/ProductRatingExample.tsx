import ReactStarsRating from '../lib';
import Card from './Card';

const REVIEWS = [
  { author: 'Marta', rating: 5, text: 'Exactly what the docs promised.' },
  { author: 'Ilya', rating: 4.5, text: 'Keyboard support won me over.' },
  { author: 'Sam', rating: 3.5, text: 'Great, though I wanted more presets.' },
];

const DISTRIBUTION = [
  { stars: 5, share: 68 },
  { stars: 4, share: 21 },
  { stars: 3, share: 7 },
  { stars: 2, share: 3 },
  { stars: 1, share: 1 },
];

const AVERAGE = 4.5;

const ProductRatingExample = () => (
  <Card
    title="Product summary"
    description="A read-only rating with isEdit={false}: no hover, no focus, no keyboard."
  >
    <div className="flex items-center gap-4">
      <p className="font-display text-4xl text-slate-900">
        {AVERAGE.toFixed(1)}
      </p>
      <div>
        <ReactStarsRating
          value={AVERAGE}
          isEdit={false}
          size={22}
          starGap={2}
          ariaLabel={`Average rating ${AVERAGE} out of 5`}
        />
        <p className="mt-1 text-xs text-slate-500">1,284 ratings</p>
      </div>
    </div>

    <ul className="mt-6 space-y-2">
      {DISTRIBUTION.map((row) => (
        <li key={row.stars} className="flex items-center gap-3 text-xs">
          <span className="w-8 text-slate-500">{row.stars}★</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-ember-500"
              style={{ width: `${row.share}%` }}
            />
          </span>
          <span className="w-8 text-right text-slate-500">{row.share}%</span>
        </li>
      ))}
    </ul>

    <ul className="mt-6 space-y-4 border-t border-slate-100 pt-6">
      {REVIEWS.map((review) => (
        <li key={review.author}>
          <div className="flex items-center gap-2">
            <ReactStarsRating
              value={review.rating}
              isEdit={false}
              size={14}
              ariaLabel={`${review.author} rated ${review.rating} out of 5`}
            />
            <span className="text-xs font-medium text-slate-900">
              {review.author}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{review.text}</p>
        </li>
      ))}
    </ul>
  </Card>
);

export default ProductRatingExample;
