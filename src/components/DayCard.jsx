'use client';

import { useState } from 'react';
import StopItem from './StopItem';
import { Plus } from 'lucide-react';

export default function DayCard({ day, destination, currency, onUpdateStops }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState('Sightseeing');
  const [newDescription, setNewDescription] = useState('');

  const handleMoveUp = (stopId) => {
    const index = day.stops.findIndex(s => s.id === stopId);
    if (index <= 0) return;
    const newStops = [...day.stops];
    const [movedItem] = newStops.splice(index, 1);
    newStops.splice(index - 1, 0, movedItem);
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleMoveDown = (stopId) => {
    const index = day.stops.findIndex(s => s.id === stopId);
    if (index < 0 || index >= day.stops.length - 1) return;
    const newStops = [...day.stops];
    const [movedItem] = newStops.splice(index, 1);
    newStops.splice(index + 1, 0, movedItem);
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleDelete = (stopId) => {
    const newStops = day.stops.filter(s => s.id !== stopId);
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStopObj = {
      id: `custom-stop-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime.trim() || 'Flexible Time',
      category: newCategory,
      description: newDescription.trim() || 'Custom added activity.',
      location: destination || '',
      estimatedCost: 'Free'
    };

    onUpdateStops(day.dayNumber, [...day.stops, newStopObj]);
    setNewTitle('');
    setNewTime('');
    setNewDescription('');
    setIsAdding(false);
  };

  return (
    <div className="rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] p-5 sm:p-6 space-y-5">
      {/* Day Header */}
      <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md font-serif font-bold flex items-center justify-center text-sm bg-[#162842] text-[#FAF7F0]">
            {day.dayNumber}
          </div>
          <div>
            <h3 className="font-serif font-semibold text-lg leading-snug text-[#162842]">
              {day.title}
            </h3>
            <span className="text-xs text-[#526685]">
              {day.stops.length} {day.stops.length === 1 ? 'activity' : 'activities'} scheduled
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#E8E1D5] bg-[#F7F4EC] text-[#162842] hover:border-[#E05A3A] hover:text-[#E05A3A] flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#E05A3A]" />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Add Custom Stop Form */}
      {isAdding && (
        <form onSubmit={handleAddStop} className="p-4 rounded-md border border-[#E8E1D5] bg-[#F7F4EC] space-y-3">
          <h4 className="text-xs font-semibold text-[#E05A3A] uppercase tracking-wider">New Activity</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Activity / Place title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 text-xs rounded-md outline-none focus:border-[#E05A3A] border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842]"
              required
            />
            <input
              type="text"
              placeholder="Time (e.g., 02:00 PM)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-3 py-2 text-xs rounded-md outline-none focus:border-[#E05A3A] border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-md outline-none focus:border-[#E05A3A] border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842]"
            >
              <option value="Sightseeing">Sightseeing</option>
              <option value="Food">Food & Dining</option>
              <option value="Culture">Culture & Heritage</option>
              <option value="Relaxation">Relaxation</option>
              <option value="Shopping">Shopping</option>
              <option value="Adventure">Adventure</option>
            </select>
            <input
              type="text"
              placeholder="Short description / tips"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="px-3 py-2 text-xs rounded-md outline-none focus:border-[#E05A3A] border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#526685] hover:text-[#162842] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#E05A3A] text-white text-xs font-semibold rounded-md hover:bg-[#C94A2D] transition-colors"
            >
              Save Stop
            </button>
          </div>
        </form>
      )}

      {/* List of Stops */}
      {day.stops.length === 0 ? (
        <div className="py-6 text-center border border-dashed border-[#E8E1D5] rounded-lg text-xs text-[#526685]">
          No stops planned for this day. Click &quot;Add Stop&quot; to create one!
        </div>
      ) : (
        <div className="space-y-3">
          {day.stops.map((stop, index) => (
            <StopItem
              key={stop.id}
              stop={stop}
              destination={destination}
              currency={currency}
              isFirst={index === 0}
              isLast={index === day.stops.length - 1}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
