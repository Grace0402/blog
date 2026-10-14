export default function Footer() {
  return (
    <footer className="text-center py-8 text-sm text-stone-400 dark:text-stone-600">
      <p>&copy; {new Date().getFullYear()} My Blog</p>
    </footer>
  );
}
