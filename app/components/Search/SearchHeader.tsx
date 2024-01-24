import {Svg} from '~/components';

export function SearchHeader({closeSearch}) {
  return (
    <div className="relative flex h-14 items-center justify-center border-b border-b-border px-12">
      <button
        aria-label="Close cart"
        className="absolute left-4 top-1/2 -translate-y-1/2"
        onClick={closeSearch}
        type="button"
      >
        <Svg
          className="w-5 text-text"
          src="/svgs/arrow-left.svg#arrow-left"
          title="Arrow Left"
          viewBox="0 0 24 24"
        />
      </button>

      <h2 className="text-center text-lg">Search</h2>
    </div>
  );
}

SearchHeader.displayName = 'SearchHeader';
