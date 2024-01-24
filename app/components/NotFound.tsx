// TODO: style not found page

export function NotFound({type = 'page'}: {type?: string}) {
  const heading = `We've lost this ${type}`;
  const description = `We couldn't find the ${type} you're looking for. Try checking the URL or heading back to the home page.`;

  return (
    <section className="container flex flex-col items-center py-10 text-center">
      <h1>404</h1>
      <h2>{heading}</h2>
      <p>{description}</p>
    </section>
  );
}
