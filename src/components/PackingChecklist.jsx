'use client';

import { useState } from 'react';
import { Briefcase, CheckSquare, Square, Plus, FileText, Shirt, Zap, ShieldCheck } from 'lucide-react';

export default function PackingChecklist({ packingChecklist, destination }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('essentials');

  if (!packingChecklist) return null;

  const categories = [
    { key: 'documents', label: 'Documents', icon: FileText, items: packingChecklist.documents || [] },
    { key: 'clothing', label: 'Clothing', icon: Shirt, items: packingChecklist.clothing || [] },
    { key: 'electronics', label: 'Electronics', icon: Zap, items: packingChecklist.electronics || [] },
    { key: 'essentials', label: 'Essentials', icon: ShieldCheck, items: packingChecklist.essentials || [] }
  ];

  let totalItems = 0;
  let packedItems = 0;

  categories.forEach(cat => {
    cat.items.forEach(item => {
      totalItems++;
      if (checkedItems[item]) packedItems++;
    });
  });

  customItems.forEach(item => {
    totalItems++;
    if (checkedItems[item]) packedItems++;
  });

  const progressPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const toggleItem = (itemText) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setCustomItems(prev => [...prev, newItemText.trim()]);
    setNewItemText('');
  };

  return (
    <div className="rounded-lg border border-[#E8E1D5] bg-white p-5 sm:p-6 space-y-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E8E1D5] pb-4">
        <div className="flex items-center gap-2 font-semibold text-sm text-[#162842]">
          <Briefcase className="w-4 h-4 text-[#E05A3A]" />
          <span className="font-serif">Packing Manifest for {destination}</span>
        </div>

        {/* Progress Pill in Coral Orange */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold border border-[#E05A3A]/40 bg-[#FAECE8] text-[#E05A3A]">
          <span>{packedItems} of {totalItems} packed ({progressPercent}%)</span>
        </div>
      </div>

      {/* Progress Bar in Coral Orange */}
      <div className="w-full h-1.5 rounded-full overflow-hidden bg-[#F7F4EC]">
        <div 
          className="bg-[#E05A3A] h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8E1D5] pb-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                isSelected
                  ? 'bg-[#162842] text-white border-[#162842]'
                  : 'bg-[#F7F4EC] text-[#526685] border-[#E8E1D5] hover:border-[#E05A3A] hover:text-[#162842]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid for Active Category */}
      <div className="space-y-2">
        {categories
          .filter(cat => cat.key === selectedCategory)
          .map(cat => (
            <div key={cat.key} className="space-y-2">
              {cat.items.map((item, idx) => {
                const isChecked = Boolean(checkedItems[item]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleItem(item)}
                    className={`flex items-center gap-3 p-3 rounded-md border transition-colors cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#F7F4EC] border-[#E8E1D5] text-[#8FA5C2] line-through'
                        : 'bg-[#FDFBF7] border-[#E8E1D5] hover:border-[#E05A3A]/60 text-[#162842]'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#E05A3A] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8FA5C2] shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm">{item}</span>
                  </div>
                );
              })}
            </div>
          ))}

        {/* Custom Items Section if present */}
        {customItems.length > 0 && selectedCategory === 'essentials' && (
          <div className="pt-2 space-y-2 border-t border-[#E8E1D5]">
            <span className="text-[10px] uppercase font-bold text-[#8FA5C2]">Custom Added Items</span>
            {customItems.map((item, idx) => {
              const isChecked = Boolean(checkedItems[item]);
              return (
                <div
                  key={idx}
                  onClick={() => toggleItem(item)}
                  className={`flex items-center gap-3 p-3 rounded-md border transition-colors cursor-pointer select-none ${
                    isChecked
                      ? 'bg-[#F7F4EC] border-[#E8E1D5] text-[#8FA5C2] line-through'
                      : 'bg-[#FDFBF7] border-[#E8E1D5] hover:border-[#E05A3A]/60 text-[#162842]'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#E05A3A] shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#8FA5C2] shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm">{item}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddCustomItem} className="flex gap-2 pt-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom packing item..."
          className="flex-1 px-3.5 py-2 text-xs border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842] placeholder:text-[#8899B0] rounded-md outline-none focus:border-[#E05A3A]"
        />
        <button
          type="submit"
          disabled={!newItemText.trim()}
          className="px-4 py-2 bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold rounded-md flex items-center gap-1 transition-colors disabled:opacity-40 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}
