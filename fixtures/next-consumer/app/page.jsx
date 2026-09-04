import ReactStarsRating from 'react-awesome-stars-rating';
import RatingForm from './rating-form';

// No client directive here: the package must preserve its own client boundary.
export default function Page() {
  return (
    <main>
      <h1>Installed Next.js consumer</h1>
      <ReactStarsRating value={4.3} readOnly ariaLabel="Average rating" />
      <RatingForm />
    </main>
  );
}
