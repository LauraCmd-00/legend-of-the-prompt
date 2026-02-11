interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="px-4 py-3 border-b border-rpg-border">
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-rpg-muted">{subtitle}</p>}
    </header>
  );
}
