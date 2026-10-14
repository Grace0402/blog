import ChatterWall from '../../components/ChatterWall';

export default function ChatterPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-2">留言墙</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">留下的足迹，每一张便签都是一份温暖</p>
      </div>
      <ChatterWall />
    </div>
  );
}