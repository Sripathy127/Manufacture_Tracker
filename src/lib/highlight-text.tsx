export function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const i = lowerText.indexOf(lowerQuery);

  if (i === -1) return <>{text}</>;

  const before = text.slice(0, i);
  const match = text.slice(i, i + query.length);
  const after = text.slice(i + query.length);

  return (
    <>
      <span className="font-normal">
        {before}
        <span className="text-orange-100">{match}</span>
        {after}
      </span>
    </>
  );
}
