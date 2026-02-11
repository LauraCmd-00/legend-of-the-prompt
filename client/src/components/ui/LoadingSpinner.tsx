export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="w-10 h-10 border-4 border-rpg-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
