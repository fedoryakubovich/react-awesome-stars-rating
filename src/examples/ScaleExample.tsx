import { useState } from 'react';

import ReactStarsRating from '../lib';
import Card from './Card';

const SIZES = [16, 24, 32, 44];

const ScaleExample = () => {
  const [tenPoint, setTenPoint] = useState(7);
  const [whole, setWhole] = useState(3);

  return (
    <Card
      title="Scales and sizes"
      description="count, size, starGap and isHalf cover most rating layouts."
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Sizes
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-6">
            {SIZES.map((size) => (
              <div key={size} className="text-center">
                <ReactStarsRating
                  value={4}
                  isEdit={false}
                  size={size}
                  ariaLabel={`Sample rating at ${size} pixels`}
                />
                <p className="mt-1 text-[11px] text-slate-500">{size}px</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Ten point scale
          </p>
          <div className="mt-3">
            <ReactStarsRating
              id="ten-point"
              value={tenPoint}
              onChange={setTenPoint}
              count={10}
              size={22}
              starGap={2}
              isHalf={false}
            />
            <p className="mt-2 text-sm text-slate-600">
              Scored{' '}
              <span className="font-medium text-slate-900">{tenPoint}</span> of
              10
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Whole stars only
          </p>
          <div className="mt-3">
            <ReactStarsRating
              id="whole-stars"
              value={whole}
              onChange={setWhole}
              size={28}
              starGap={8}
              isHalf={false}
              primaryColor="#0ea5e9"
              secondaryColor="#dbeafe"
            />
            <p className="mt-2 text-sm text-slate-600">
              isHalf={'{false}'} snaps to{' '}
              <span className="font-medium text-slate-900">{whole}</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScaleExample;
