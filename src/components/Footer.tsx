const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t">
      <p>Footer</p>
      <p>&copy; {CURRENT_YEAR}</p>
    </footer>
  );
}
