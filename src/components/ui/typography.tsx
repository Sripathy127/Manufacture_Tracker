import * as React from "react";

export function TypographyH1({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={`scroll-m-20 text-center text-6xl font-arboria-bold font-bold tracking-tight text-balance ${className || ""}`}
      {...props}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`scroll-m-20 text-xl font-arboria-bold font-bold tracking-tight first:mt-0 ${className || ""}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`scroll-m-20 text-sm font-arboria-bold font-bold tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={`scroll-m-20 text-xs font-arboria-bold font-bold tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </h4>
  );
}

export function TypographyH5({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={`scroll-m-20 text-xs font-arboria-medium font-medium tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </h5>
  );
}

export function TypographyBody1({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <p
      className={`scroll-m-20 text-xl font-gotham font-regular tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyBody2({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <p
      className={`scroll-m-20 text-sm font-gotham font-regular ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyCaption1({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`scroll-m-20 text-xs font-gotham font-regular tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyCaption2({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`scroll-m-20 text-2xs font-gotham font-regular tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyCalltoaction({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`scroll-m-20 text-sm font-arboria-medium font-medium tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyP({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`leading-7 not-first:mt-6 ${className || ""}`} {...props}>
      {children}
    </p>
  );
}

export function TypographyBlockquote({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={`mt-6 border-l-2 pl-6 italic ${className || ""}`}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function TypographyTable({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`my-6 w-full overflow-y-auto ${className || ""}`}
      {...props}
    >
      <table className="w-full">
        <thead>
          <tr className="even:bg-muted m-0 border-t p-0">
            <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
              King's Treasury
            </th>
            <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
              People's happiness
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="even:bg-muted m-0 border-t p-0">
            <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
              Empty
            </td>
            <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
              Overflowing
            </td>
          </tr>
          <tr className="even:bg-muted m-0 border-t p-0">
            <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
              Modest
            </td>
            <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
              Satisfied
            </td>
          </tr>
          <tr className="even:bg-muted m-0 border-t p-0">
            <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
              Full
            </td>
            <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
              Ecstatic
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TypographyList({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className || ""}`}
      {...props}
    >
      {children}
    </ul>
  );
}

export function TypographyInlineCode({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={`bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className || ""}`}
      {...props}
    >
      {children}
    </code>
  );
}

export function TypographyLead({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-muted-foreground text-xl ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyLarge({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-lg font-semibold ${className || ""}`} {...props}>
      {children}
    </div>
  );
}

export function TypographySmall({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <small
      className={`text-sm leading-none font-medium ${className || ""}`}
      {...props}
    >
      {children}
    </small>
  );
}

export function TypographyMuted({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-muted-foreground text-sm ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}
