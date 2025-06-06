export default function Progress({ step, total }) {
    return (
      <div className="w-full mb-6 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    );
  }