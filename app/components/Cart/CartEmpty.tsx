import {Link} from '~/components';

export function CartEmpty({closeCart, settings}) {
  const {links, message} = {...settings?.emptyCart};

  return (
    <ul className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 px-5">
      <h3 className="text-center text-xl font-bold md:text-2xl">{message}</h3>

      {links?.map(({link}, index) => {
        return (
          <li key={index}>
            <Link
              aria-label={link?.text}
              className="btn-primary"
              to={link?.url}
              newTab={link?.newTab}
              onClick={closeCart}
              type={link?.type}
            >
              {link?.text}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

CartEmpty.displayName = 'CartEmpty';
